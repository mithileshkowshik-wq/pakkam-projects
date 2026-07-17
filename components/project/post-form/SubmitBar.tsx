'use client';

import { Button } from '@/components/ui';

export interface SubmitBarProps {
  onPublish: () => void;
  publishing?: boolean;
}

export function SubmitBar({ onPublish, publishing }: SubmitBarProps) {
  return (
    <div className="sticky bottom-0 mt-8 flex items-center justify-end gap-4 border-t border-border bg-bg/90 py-4 backdrop-blur">
      <Button variant="primary" loading={publishing} onClick={onPublish}>
        Publish Project
      </Button>
    </div>
  );
}
