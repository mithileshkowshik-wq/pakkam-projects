import { H3, Sub } from '@/components/ui';

export interface RoleListItemProps {
  index: number;
  title: string;
  description?: string;
}

export function RoleListItem({ index, title, description }: RoleListItemProps) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-gradient-to-br from-tag-bg to-accent-border/50 font-mono text-fine font-semibold text-primary-hover ring-1 ring-inset ring-primary/10">
        {String(index).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <H3>{title}</H3>
        {description && <Sub className="mt-0.5 text-[13.5px]">{description}</Sub>}
      </div>
    </div>
  );
}
