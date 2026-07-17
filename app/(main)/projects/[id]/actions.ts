'use server';

import { getCurrentUser } from '@/lib/data';
import { prisma } from '@/lib/data/prisma';
import { collabRequestSchema } from '@/lib/validations/collabRequest';

import { getOrCreateDmConversation, sendMessage } from '../../messages/actions';

export type CollabRequestStatus = 'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface PendingCollabRequest {
  id: string;
  message: string | null;
  createdAt: string;
  requester: { id: string; name: string; username: string; avatarUrl?: string; headline?: string };
}

export interface SendCollabRequestResult {
  ok: boolean;
  error?: string;
}

export async function sendCollabRequest(projectId: string, message: string): Promise<SendCollabRequestResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { ok: false, error: 'You need to be signed in to send a request.' };

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!project) return { ok: false, error: 'Project not found.' };
  if (project.ownerId === currentUser.id) {
    return { ok: false, error: "You can't request to join your own project." };
  }

  const parsed = collabRequestSchema.safeParse({ message });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please write a short message.' };
  }

  const existing = await prisma.collabRequest.findFirst({
    where: { projectId, requesterId: currentUser.id, status: 'PENDING' },
  });
  if (existing) return { ok: true }; // already pending — treat a resubmit as a no-op success

  await prisma.collabRequest.create({
    data: { projectId, requesterId: currentUser.id, message: parsed.data.message },
  });
  return { ok: true };
}

/** Lets RequestToCollaborateCard render the right initial state server-side (not just after a
 * fresh submit) — most-recent request first, since a user could have been declined once and be
 * sending a fresh one. */
export async function getMyCollabRequestStatus(projectId: string, userId: string): Promise<CollabRequestStatus> {
  const request = await prisma.collabRequest.findFirst({
    where: { projectId, requesterId: userId },
    orderBy: { createdAt: 'desc' },
    select: { status: true },
  });
  return request?.status ?? 'NONE';
}

/** Owner-only — verified server-side, never trust the caller. */
export async function getPendingCollabRequests(projectId: string): Promise<PendingCollabRequest[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!project || project.ownerId !== currentUser.id) return [];

  const rows = await prisma.collabRequest.findMany({
    where: { projectId, status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    include: { requester: { select: { id: true, name: true, username: true, avatarUrl: true, headline: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    message: r.message,
    createdAt: r.createdAt.toISOString(),
    requester: {
      id: r.requester.id,
      name: r.requester.name,
      username: r.requester.username,
      avatarUrl: r.requester.avatarUrl ?? undefined,
      headline: r.requester.headline ?? undefined,
    },
  }));
}

export interface RespondResult {
  ok: boolean;
  error?: string;
}

export async function respondToCollabRequest(
  requestId: string,
  decision: 'ACCEPTED' | 'DECLINED',
): Promise<RespondResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { ok: false, error: 'Unauthorized' };

  const request = await prisma.collabRequest.findUnique({
    where: { id: requestId },
    include: { project: { select: { id: true, ownerId: true, title: true } } },
  });
  if (!request) return { ok: false, error: 'Request not found.' };
  if (request.project.ownerId !== currentUser.id) return { ok: false, error: 'Unauthorized' };
  if (request.status !== 'PENDING') return { ok: true }; // already resolved — idempotent no-op

  if (decision === 'DECLINED') {
    await prisma.collabRequest.update({ where: { id: requestId }, data: { status: 'DECLINED' } });
    return { ok: true };
  }

  try {
    await prisma.$transaction([
      prisma.collabRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } }),
      prisma.collaboration.create({ data: { projectId: request.project.id, userId: request.requesterId } }),
    ]);
  } catch {
    // Unique [projectId,userId] violation = already a collaborator somehow (e.g. a second
    // pending request from the same person got accepted twice in separate tabs) — not an error.
  }

  // Outside the transaction: a real DM, reusing existing messaging infra rather than building a
  // notification system. Sent as the owner, since getOrCreateDmConversation/sendMessage both use
  // the current session (the owner, in this action) as the acting user.
  try {
    const conversationId = await getOrCreateDmConversation(request.requesterId);
    await sendMessage(conversationId, `🎉 You've been accepted onto ${request.project.title}!`);
  } catch {
    // Non-fatal — the Collaboration record is what actually matters; a failed courtesy DM
    // shouldn't roll back a successful accept.
  }

  return { ok: true };
}
