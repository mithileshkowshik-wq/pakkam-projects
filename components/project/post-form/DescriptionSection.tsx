'use client';

import { List } from 'lucide-react';

import { Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DescriptionSectionProps {
  description: string;
  setDescription: (v: string) => void;
}

const toolbarBtn =
  'flex h-8 w-8 items-center justify-center rounded-tile border border-border bg-surface text-[13px] font-semibold text-text-secondary transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

// Judgment call: this formatting toolbar is visual-only. A real rich-text editor (Tiptap) is
// explicitly deferred to a later pass, so these buttons intentionally do nothing yet.
export function DescriptionSection({ description, setDescription }: DescriptionSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="project-description" className="text-sm font-semibold text-ink">
          Tell people about it
        </label>
        <div className="flex items-center gap-1.5" aria-hidden>
          <button type="button" tabIndex={-1} className={toolbarBtn}>
            B
          </button>
          <button type="button" tabIndex={-1} className={cn(toolbarBtn, 'italic')}>
            I
          </button>
          <button type="button" tabIndex={-1} className={toolbarBtn}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Textarea
        id="project-description"
        className="min-h-[130px]"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's the vision? What have you built so far? What kind of people are you hoping to work with?"
      />
    </div>
  );
}
