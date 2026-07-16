import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/data';
import { formatRelativeDate, truncateWords } from '@/lib/utils';
import { Avatar, EmptyState, H1, SectionDivider } from '@/components/ui';

import { getConversations } from './actions';

export default async function MessagesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const conversations = await getConversations(currentUser.id);

  return (
    <div className="mx-auto max-w-[680px]">
      <H1 className="text-[28px]">Messages</H1>

      <SectionDivider />

      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" aria-hidden />}
          heading="No conversations yet"
          subtext="Message someone from their profile to start chatting."
        />
      ) : (
        <ul className="flex flex-col">
          {conversations.map((c, i) => (
            <li key={c.id}>
              {i > 0 && <SectionDivider tight />}
              <Link
                href={`/messages/${c.id}`}
                className="flex items-center gap-3 py-3.5 transition-colors hover:bg-border-light/50 rounded-md px-2 -mx-2"
              >
                <Avatar size={42} name={c.otherParticipant.name} src={c.otherParticipant.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] font-semibold text-ink">
                      {c.otherParticipant.name}
                    </span>
                    {c.lastMessage && (
                      <span className="flex-none text-[12px] text-text-meta">
                        {formatRelativeDate(c.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={
                      c.unread
                        ? 'truncate text-[13.5px] font-medium text-ink'
                        : 'truncate text-[13.5px] text-text-secondary'
                    }
                  >
                    {c.lastMessage ? truncateWords(c.lastMessage.content, 12) : 'No messages yet'}
                  </p>
                </div>
                {c.unread && (
                  <span className="h-2.5 w-2.5 flex-none rounded-full bg-primary" aria-label="Unread" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
