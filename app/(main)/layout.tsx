import { redirect } from 'next/navigation';

import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { UnreadProvider } from '@/components/providers/UnreadProvider';
import { getCurrentUser } from '@/lib/data';

import { getConversations } from './messages/actions';

/**
 * Judgment call: we intentionally skip the design mockup's floating rounded-card / shadow-shell
 * chrome (`.scr`/`.shell`). That treatment is a *prototype presentation* affectation — a real
 * deployed app is full-viewport. If a boxed-canvas look is ever wanted, wrap this flex container
 * in `rounded-[22px] shadow-shell overflow-hidden` with an outer centered max-width.
 */
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Defensive fallback only — middleware.ts already guarantees a session on every
  // (main) route, so this redirect should be unreachable in practice.
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const conversations = await getConversations(currentUser.id);
  const initialUnreadConversationIds = conversations.filter((c) => c.unread).map((c) => c.id);

  return (
    <UnreadProvider currentUserId={currentUser.id} initialUnreadConversationIds={initialUnreadConversationIds}>
      {/* Sidebar (≥768px) and BottomNav (<768px) each self-manage visibility via Tailwind breakpoints;
          screen width isn't known at request time, so this stays a pure-CSS split, not JS branching. */}
      <div className="flex min-h-screen bg-bg">
        <Sidebar currentUser={currentUser} />
        {/* Extra bottom padding <768px so the fixed BottomNav (+ raised FAB) doesn't overlap content.
            Inner wrapper caps line lengths on ultrawide viewports without touching per-screen layout. */}
        <main className="min-w-0 flex-1 px-5 py-7 pb-28 tablet:px-8 tablet:py-8 tablet:pb-8 desktop:px-10 desktop:py-9">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
        <BottomNav currentUser={currentUser} />
      </div>
    </UnreadProvider>
  );
}
