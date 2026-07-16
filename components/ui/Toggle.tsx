import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  /** For screen readers; the visible label is rendered by the caller per the design. */
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[26px] w-[46px] flex-none items-center rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,.15)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        // OFF state is inferred (design only shows ON): neutral border-token bg + knob to the left
        checked ? 'bg-primary' : 'bg-border',
        className,
      )}
    >
      <span
        className={cn(
          'absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)] transition-transform duration-150',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}
