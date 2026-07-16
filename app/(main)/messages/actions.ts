'use server';

import { getCurrentUser } from '@/lib/data';
import { prisma } from '@/lib/data/prisma';
import { messageSchema } from '@/lib/validations/message';

export interface ConversationListItem {
  id: string;
  otherParticipant: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  lastMessage: { content: string; createdAt: string } | null;
  unread: boolean;
}

export interface ThreadMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  /** Present on messages fetched server-side; absent on optimistic/Realtime-appended ones. */
  sender?: { id: string; name: string; avatarUrl?: string };
  /** Client-only flag for an optimistic message still in flight. */
  sending?: boolean;
}

/** DIRECT conversation with both these users, guarded to exactly 2 participants. */
const dmWhere = (userA: string, userB: string) => ({
  type: 'DIRECT' as const,
  AND: [
    { participants: { some: { userId: userA } } },
    { participants: { some: { userId: userB } } },
  ],
});

async function requireParticipant(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) throw new Error('Not a participant of this conversation');
  return participant;
}

export async function getConversations(userId: string): Promise<ConversationListItem[]> {
  const rows = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } },
      },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  const items = rows.flatMap((convo): ConversationListItem[] => {
    const self = convo.participants.find((p) => p.userId === userId);
    const other = convo.participants.find((p) => p.userId !== userId);
    // A well-formed DM has exactly one "other" participant; skip malformed rows.
    if (!other) return [];

    const latest = convo.messages[0] ?? null;
    const unread =
      latest != null && (self?.lastReadAt == null || self.lastReadAt < latest.createdAt);

    return [
      {
        id: convo.id,
        otherParticipant: {
          id: other.user.id,
          name: other.user.name,
          username: other.user.username,
          avatarUrl: other.user.avatarUrl ?? undefined,
        },
        lastMessage: latest ? { content: latest.content, createdAt: latest.createdAt.toISOString() } : null,
        unread,
      },
    ];
  });

  // Most-recent-message-first; message-less conversations sort to the bottom.
  return items.sort((a, b) => {
    const at = a.lastMessage ? Date.parse(a.lastMessage.createdAt) : 0;
    const bt = b.lastMessage ? Date.parse(b.lastMessage.createdAt) : 0;
    return bt - at;
  });
}

export async function getOrCreateDmConversation(recipientId: string): Promise<string> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('Unauthorized');
  if (recipientId === currentUser.id) throw new Error('Cannot start a conversation with yourself');

  const existing = await prisma.conversation.findFirst({
    where: dmWhere(currentUser.id, recipientId),
    include: { _count: { select: { participants: true } } },
  });
  if (existing && existing._count.participants === 2) return existing.id;

  // Race-window acceptance: two rapid clicks could each pass the check above and create two
  // DMs. We re-check inside the transaction to shrink that window; a full unique-constraint
  // hack isn't worth it for a two-person DM edge case (per spec).
  return prisma.$transaction(async (tx) => {
    const again = await tx.conversation.findFirst({
      where: dmWhere(currentUser.id, recipientId),
      include: { _count: { select: { participants: true } } },
    });
    if (again && again._count.participants === 2) return again.id;

    const convo = await tx.conversation.create({ data: { type: 'DIRECT' } });
    await tx.conversationParticipant.createMany({
      data: [
        { conversationId: convo.id, userId: currentUser.id },
        { conversationId: convo.id, userId: recipientId },
      ],
    });
    return convo.id;
  });
}

export async function getMessages(conversationId: string, cursor?: string): Promise<ThreadMessage[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('Unauthorized');
  await requireParticipant(conversationId, currentUser.id);

  const rows = await prisma.message.findMany({
    where: {
      conversationId,
      ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
  });

  // Fetched newest-first for the limit; reverse to chronological for display.
  return rows.reverse().map((m) => ({
    id: m.id,
    content: m.content,
    senderId: m.senderId,
    createdAt: m.createdAt.toISOString(),
    sender: { id: m.sender.id, name: m.sender.name, avatarUrl: m.sender.avatarUrl ?? undefined },
  }));
}

export async function sendMessage(conversationId: string, content: string): Promise<ThreadMessage> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('Unauthorized');
  await requireParticipant(conversationId, currentUser.id);

  const { content: clean } = messageSchema.parse({ content });

  const message = await prisma.message.create({
    data: { conversationId, senderId: currentUser.id, content: clean },
  });

  return {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  // updateMany no-ops (count 0) if the user isn't a participant — no throw needed here.
  await prisma.conversationParticipant.updateMany({
    where: { conversationId, userId: currentUser.id },
    data: { lastReadAt: new Date() },
  });
}
