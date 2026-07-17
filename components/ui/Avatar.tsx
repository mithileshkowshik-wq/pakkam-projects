import { cn, initials } from '@/lib/utils';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 32 | 34 | 40 | 42 | 54 | 56 | 88;
  className?: string;
}

// Hairline cobalt keyline — token-backed so it re-tints per theme.
const INSET_RING = 'ring-1 ring-inset ring-primary/15';

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  const alt = `${name} profile photo`;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- mock/placeholder URLs, plain <img> is intentional
      <img
        src={src}
        alt={alt}
        style={{ width: size, height: size }}
        className={cn('flex-none rounded-full object-cover', INSET_RING, className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      className={cn(
        'flex flex-none items-center justify-center rounded-full bg-gradient-to-br from-tag-bg to-accent-border font-bold text-primary',
        INSET_RING,
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
