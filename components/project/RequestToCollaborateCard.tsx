'use client';

import { useState } from 'react';

import { Button, Card, Chip, H2, Meta, Textarea } from '@/components/ui';

export interface RequestToCollaborateCardProps {
  projectId: string;
}

type SubmitState = 'idle' | 'submitting' | 'sent';

// Soft target, not a hard cap. We deliberately do NOT reuse <CharCounter> here: it flips to coral
// once count > max, which would flag a thoughtful 150+ char message as an error. 150 is a floor to
// encourage length, so we render a neutral counter that never turns "over-limit red".
const CHAR_TARGET = 150;

export function RequestToCollaborateCard({ projectId }: RequestToCollaborateCardProps) {
  // projectId is accepted for a future real submit; the mock flow below ignores it.
  void projectId;

  const [message, setMessage] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

  async function handleSubmit() {
    setState('submitting');
    // Mock async delay — there is no real backend. This state is UI-only and resets on reload.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setState('sent');
  }

  return (
    <Card accent className="flex flex-col gap-3">
      <H2>Interested in joining?</H2>

      {state === 'sent' ? (
        // Mock-only success state: replaces the whole form and does not persist anywhere.
        <div className="flex justify-center py-2">
          <Chip variant="fill">Request sent ✓</Chip>
        </div>
      ) : (
        <>
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

          <Button
            variant="primary"
            className="w-full justify-center"
            disabled={message.trim().length === 0}
            loading={state === 'submitting'}
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
