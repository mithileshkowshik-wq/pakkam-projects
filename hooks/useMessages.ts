'use client';

import { useCallback, useEffect, useState } from 'react';

import { sendMessage as sendMessageAction, type ThreadMessage } from '@/app/(main)/messages/actions';
import { createClient } from '@/lib/supabase/client';

interface UseMessagesArgs {
  conversationId: string;
  currentUserId: string;
  initialMessages: ThreadMessage[];
}

interface UseMessages {
  messages: ThreadMessage[];
  sendMessage: (content: string) => Promise<void>;
}

/** Shape of a `Message` row as delivered by Supabase Realtime (column names match the Prisma model). */
type MessageRow = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export function useMessages({ conversationId, currentUserId, initialMessages }: UseMessagesArgs): UseMessages {
  const [messages, setMessages] = useState<ThreadMessage[]>(initialMessages);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    // Uses Supabase's "Broadcast from Database" pattern (a trigger calling
    // realtime.broadcast_changes on Message INSERT, authorized via an RLS policy on
    // realtime.messages) rather than the legacy postgres_changes API — postgres_changes
    // silently dropped events under this app's join-based participancy check even with a
    // verified-correct JWT/grants/policy, which matches Supabase's own guidance that
    // Broadcast is the more robust, currently-recommended mechanism. Private channels
    // require the socket's access token to be set before subscribing.
    const setup = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      supabase.realtime.setAuth(session?.access_token);

      channel = supabase
        .channel(`conversation:${conversationId}`, { config: { private: true } })
        .on('broadcast', { event: 'INSERT' }, (payload) => {
          const row = (payload.payload as { record: MessageRow }).record;
          setMessages((prev) => {
            // Dedupe by exact id: our own sent message is already present (temp entry
            // replaced by the real row on send-resolve), so skip its Realtime echo to
            // avoid double render.
            if (prev.some((m) => m.id === row.id)) return prev;
            return [
              ...prev,
              { id: row.id, content: row.content, senderId: row.senderId, createdAt: row.createdAt },
            ];
          });
        })
        .subscribe();
    };
    void setup();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimistic: ThreadMessage = {
        id: tempId,
        content: trimmed,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
        sending: true,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const saved = await sendMessageAction(conversationId, trimmed);
        // We hold both the temp id and the real returned row here, so replace directly by id —
        // no fuzzy matching. If the Realtime echo already appended it, drop the temp entry instead.
        setMessages((prev) => {
          if (prev.some((m) => m.id === saved.id)) return prev.filter((m) => m.id !== tempId);
          return prev.map((m) => (m.id === tempId ? saved : m));
        });
      } catch {
        // Roll the optimistic message back on failure.
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [conversationId, currentUserId],
  );

  return { messages, sendMessage };
}
