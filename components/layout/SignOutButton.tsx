'use client';

import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

async function signOutAndRedirect(router: ReturnType<typeof useRouter>) {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push('/login');
}

export interface SignOutButtonProps {
  className?: string;
}

/** Full labeled button — used on the owner's Profile page. */
export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signOutAndRedirect(router);
  };

  return (
    <Button variant="ghost" onClick={handleClick} loading={loading} className={className}>
      <LogOut className="h-4 w-4" aria-hidden />
      Sign out
    </Button>
  );
}

export interface SignOutIconButtonProps {
  className?: string;
  icon: LucideIcon;
}

/** Compact icon-only variant — used in the sidebar's UserCard. */
export function SignOutIconButton({ className, icon: Icon }: SignOutIconButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    void signOutAndRedirect(router);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Sign out"
      className={cn(
        'flex-none rounded-md p-1.5 text-sidebar-userSub transition-colors hover:bg-white/[.06] hover:text-white',
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
