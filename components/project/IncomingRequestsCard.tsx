'use client';

import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { Avatar, Button, Card, EmptyState, H2, Meta, SectionDivider } from '@/components/ui';
import { formatRelativeDate } from '@/lib/utils';

import { respondToCollabRequest, type PendingCollabRequest } from '@/app/(main)/projects/[id]/actions';

export interface IncomingRequestsCardProps {
  requests: PendingCollabRequest[];
}

export function IncomingRequestsCard({ requests: initialRequests }: IncomingRequestsCardProps) {
  const [requests, setRequests] = useState(initialRequests);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <H2>Requests to join</H2>
        {requests.length > 0 && (
          <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-pill bg-brand-gradient px-1.5 text-fine font-bold text-white shadow-chip-primary">
            {requests.length}
          </span>
        )}
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" aria-hidden />}
          heading="No pending requests"
          subtext="When someone asks to join, they'll show up here."
        />
      ) : (
        <div className="flex flex-col">
          {requests.map((request, i) => (
            <div key={request.id}>
              {i > 0 && <SectionDivider tight className="my-3" />}
              <RequestRow request={request} onResolved={(id) => setRequests((prev) => prev.filter((r) => r.id !== id))} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RequestRow({
  request,
  onResolved,
}: {
  request: PendingCollabRequest;
  onResolved: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [actingOn, setActingOn] = useState<'ACCEPTED' | 'DECLINED' | null>(null);

  const respond = (decision: 'ACCEPTED' | 'DECLINED') => {
    setActingOn(decision);
    startTransition(async () => {
      await respondToCollabRequest(request.id, decision);
      onResolved(request.id);
    });
  };

  return (
    <div className="flex items-start gap-3">
      <Link href={`/profile/${request.requester.username}`} className="flex-none">
        <Avatar
          size={40}
          name={request.requester.name}
          src={request.requester.avatarUrl}
          className="transition-transform duration-200 ease-out-soft hover:scale-105"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/profile/${request.requester.username}`}
            className="truncate text-[14px] font-semibold text-ink hover:underline"
          >
            {request.requester.name}
          </Link>
          <Meta className="flex-none text-[11.5px] text-text-meta">{formatRelativeDate(request.createdAt)}</Meta>
        </div>
        {request.requester.headline && (
          <p className="truncate text-[12.5px] text-text-secondary">{request.requester.headline}</p>
        )}
        {request.message && (
          <p className="mt-2 rounded-[10px] rounded-tl-none bg-bg/70 px-3 py-2 text-meta leading-[1.5] text-text-secondary">
            {request.message}
          </p>
        )}

        <div className="mt-2.5 flex gap-2">
          <Button
            variant="primary"
            className="px-3 py-1.5 text-[13px]"
            loading={isPending && actingOn === 'ACCEPTED'}
            disabled={isPending && actingOn !== 'ACCEPTED'}
            onClick={() => respond('ACCEPTED')}
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            className="px-3 py-1.5 text-[13px]"
            loading={isPending && actingOn === 'DECLINED'}
            disabled={isPending && actingOn !== 'DECLINED'}
            onClick={() => respond('DECLINED')}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
