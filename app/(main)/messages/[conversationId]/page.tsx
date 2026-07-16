import { notFound, redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/data';
import { prisma } from '@/lib/data/prisma';
import { MessageThread } from '@/components/messaging/MessageThread';

import { getMessages } from '../actions';

interface ThreadPageProps {
  params: { conversationId: string };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } },
      },
    },
  });
  if (!conversation) notFound();

  const isParticipant = conversation.participants.some((p) => p.userId === currentUser.id);
  if (!isParticipant) redirect('/messages');

  const other = conversation.participants.find((p) => p.userId !== currentUser.id);
  if (!other) redirect('/messages');

  const initialMessages = await getMessages(params.conversationId);

  return (
    <MessageThread
      conversationId={params.conversationId}
      currentUserId={currentUser.id}
      otherParticipant={{
        id: other.user.id,
        name: other.user.name,
        username: other.user.username,
        avatarUrl: other.user.avatarUrl ?? undefined,
      }}
      initialMessages={initialMessages}
    />
  );
}
