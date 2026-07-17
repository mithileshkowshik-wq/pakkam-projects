'use client';

import { useState } from 'react';

import { sendCollabRequest, type CollabRequestStatus } from '@/app/(main)/projects/[id]/actions';
import { Button, Card, Chip, H2, Meta, Textarea } from '@/components/ui';

export interface RequestToCollaborateCardProps {
  projectId: string;
  initialStatus: CollabRequestStatus;
}

// Soft target, not a hard cap. We deliberately do NOT reuse <CharCounter> here: it flips to coral
// once count > max, which would flag a thoughtful 150+ char message as an error. 150 is a floor to
// encourage length, so we render a neutral counter that never turns "over-limit red".
const CHAR_TARGET = 150;

export function RequestToCollaborateCard({ projectId, initialStatus }: RequestToCollaborateCardProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<CollabRequestStatus>(initialStatus);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const result = await sendCollabRequest(projectId, message);
    setSubmitting(false);
    if (result.ok) {
      setStatus('PENDING');
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  }

  return (
    <Card accent className="flex flex-col gap-3">
      <H2>Interested in joining?</H2>

      {status === 'PENDING' ? (
        <div className="flex justify-center py-2 duration-300 ease-out-soft animate-in fade-in zoom-in-95">
          <Chip variant="fill">Request sent ✓</Chip>
        </div>
      ) : status === 'ACCEPTED' ? (
        <div className="flex justify-center py-2 duration-300 ease-out-soft animate-in fade-in zoom-in-95">
          <Chip variant="fill">You&apos;re a collaborator 🎉</Chip>
        </div>
      ) : (
        <>
          {status === 'DECLINED' && (
            <Meta className="text-text-secondary">
              Your last request wasn&apos;t accepted — you can send another below.
            </Meta>
          )}

          <Textarea
            placeholder="What excites you about this project, and what would you bring?"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <div className="flex items-center justify-between">
            <Meta>Aim for {CHAR_TARGET}+ characters</Meta>
            <span className="font-mono text-[11px] tabular-nums tracking-[0.06em] text-text-meta">
              {message.length} / {CHAR_TARGET}
            </span>
          </div>

          {error && <Meta className="text-primary">{error}</Meta>}

          <Button
            variant="primary"
            className="w-full justify-center"
            disabled={message.trim().length === 0}
            loading={submitting}
            onClick={handleSubmit}
          >
            Send Request
          </Button>

          <Meta className="text-center text-text-meta">
            The owner will review your profile and message you back.
          </Meta>
        </>
      )}
    </Card>
  );
}
