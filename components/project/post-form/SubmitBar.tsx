'use client';

import { Button, Meta } from '@/components/ui';
import { formatRelativeDate } from '@/lib/utils';

export interface SubmitBarProps {
  draftSavedAt: Date | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  publishing?: boolean;
}

function draftStatus(draftSavedAt: Date | null): string {
  if (!draftSavedAt) return 'Not saved yet';
  const secondsAgo = (Date.now() - draftSavedAt.getTime()) / 1000;
  if (secondsAgo < 60) return 'Draft saved · just now';
  return `Draft saved · ${formatRelativeDate(draftSavedAt.toISOString())}`;
}

export function SubmitBar({ draftSavedAt, onSaveDraft, onPublish, publishing }: SubmitBarProps) {
  return (
    <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-4 border-t border-border bg-bg/90 py-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <span
          className={draftSavedAt ? 'h-2 w-2 flex-none rounded-full bg-teal' : 'h-2 w-2 flex-none rounded-full bg-border'}
          aria-hidden
        />
        <Meta className="text-text-meta">{draftStatus(draftSavedAt)}</Meta>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="default" onClick={onSaveDraft}>
          Save as Draft
        </Button>
        <Button variant="primary" loading={publishing} onClick={onPublish}>
          Publish Project
        </Button>
      </div>
    </div>
  );
}
