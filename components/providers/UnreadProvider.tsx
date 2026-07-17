'use client';

import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef } from 'react';

import { useUnreadStore } from '@/lib/stores/useUnreadStore';
import { createClient } from '@/lib/supabase/client';

export interface UnreadProviderProps {
  currentUserId: string;
  initialUnreadConversationIds: string[];
  children: React.ReactNode;
}

/** Shape of a `Message` row as delivered by the broadcast (column names match the Prisma model) —
 * same shape hooks/useMessages.ts already relies on for the per-conversation broadcast. */
interface MessageRow {
  id: string;
  conversationId: string;
  senderId: string;
}

export function UnreadProvider({ currentUserId, initialUnreadConversationIds, children }: UnreadProviderProps) {
  const hydrate = useUnreadStore((s) => s.hydrate);
  const markUnread = useUnreadStore((s) => s.markUnread);

  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Seed once from the server-fetched initial state. Empty deps deliberately: (main)/layout.tsx
  // doesn't remount between routes under the App Router, so this must not re-run (and clobber
  // live Realtime-driven state) on every soft navigation. It DOES remount on a hard
  // navigation/refresh straight into a thread, though — in that case this effect and
  // MessageThread's own mark-read effect fire in the same commit, and since child effects fire
  // before parent effects, this one (the parent) would run last and clobber MessageThread's
  // clear with the now-stale server value. Filter out whichever conversation is currently open
  // so hydration can't reintroduce it as unread regardless of effect order.
  useEffect(() => {
    const activeConversationId = pathnameRef.current.startsWith('/messages/')
      ? pathnameRef.current.slice('/messages/'.length)
      : null;
    hydrate(
      activeConversationId
        ? initialUnreadConversationIds.filter((id) => id !== activeConversationId)
        : initialUnreadConversationIds,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const setup = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled || !session) return;
      supabase.realtime.setAuth(session.access_token);

      channel = supabase
        .channel(`user:${session.user.id}`, { config: { private: true } })
        .on('broadcast', { event: 'INSERT' }, (payload) => {
          const row = (payload.payload as { record: MessageRow }).record;
          if (row.senderId === currentUserId) return; // don't badge our own outgoing messages
          if (pathnameRef.current === `/messages/${row.conversationId}`) return; // already viewing it
          markUnread(row.conversationId);
        })
        .subscribe();
    };
    void setup();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentUserId, markUnread]);

  return <Fragment>{children}</Fragment>;
}
