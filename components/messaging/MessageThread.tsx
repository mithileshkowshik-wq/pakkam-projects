'use client';

import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { markConversationRead, type ThreadMessage } from '@/app/(main)/messages/actions';
import { useMessages } from '@/hooks/useMessages';
import { useUnreadStore } from '@/lib/stores/useUnreadStore';
import { cn } from '@/lib/utils';
import { MESSAGE_MAX_LENGTH } from '@/lib/validations/message';
import { Avatar, Button, Textarea } from '@/components/ui';

interface OtherParticipant {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
  otherParticipant: OtherParticipant;
  initialMessages: ThreadMessage[];
}

export function MessageThread({
  conversationId,
  currentUserId,
  otherParticipant,
  initialMessages,
}: MessageThreadProps) {
  const { messages, sendMessage } = useMessages({ conversationId, currentUserId, initialMessages });
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Opening a thread directly (not via a live broadcast while already viewing it) must also
    // clear the nav badge's client-side store — markConversationRead alone only updates the DB.
    useUnreadStore.getState().markRead(conversationId);
    void markConversationRead(conversationId);
  }, [conversationId]);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;
    setDraft('');
    void sendMessage(content);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-[680px] flex-col tablet:h-[calc(100vh-120px)]">
      <header className="flex items-center gap-3 border-b border-border pb-4">
        <Link
          href="/messages"
          aria-label="Back to messages"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-border-light hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <Link
          href={`/profile/${otherParticipant.username}`}
          className="flex items-center gap-3 min-w-0"
        >
          <Avatar size={40} name={otherParticipant.name} src={otherParticipant.avatarUrl} />
          <span className="truncate text-[15px] font-semibold text-ink">{otherParticipant.name}</span>
        </Link>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-text-secondary">
            No messages yet — say hello.
          </p>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUserId} />)
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-border pt-4">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Write a message…"
          rows={1}
          className="min-h-[44px] resize-none py-3"
          aria-label="Message"
        />
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!draft.trim()}
          aria-label="Send message"
          className="h-[44px] flex-none px-4"
        >
          <Send className="h-[18px] w-[18px]" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

// Bubble styling: own messages right-aligned on a primary fill, others left-aligned on a
// neutral tint — simple token-based rounded divs, no new primitive needed.
function MessageBubble({ message, isOwn }: { message: ThreadMessage; isOwn: boolean }) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[78%] whitespace-pre-wrap break-words rounded-lg px-[14px] py-2.5 text-[14.5px] leading-[1.45]',
          isOwn ? 'bg-primary text-white' : 'bg-border-light text-ink',
          message.sending && 'opacity-70',
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
