'use client';

import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getOrCreateDmConversation } from '@/app/(main)/messages/actions';
import { Button } from '@/components/ui';

export interface MessageButtonProps {
  userId: string;
  className?: string;
}

export function MessageButton({ userId, className }: MessageButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const conversationId = await getOrCreateDmConversation(userId);
      router.push(`/messages/${conversationId}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button variant="primary" onClick={handleClick} loading={loading} className={className}>
      <MessageSquare className="h-4 w-4" aria-hidden />
      Message
    </Button>
  );
}
