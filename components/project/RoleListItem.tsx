import { H3, Sub } from '@/components/ui';

export interface RoleListItemProps {
  index: number;
  title: string;
  description?: string;
}

export function RoleListItem({ index, title, description }: RoleListItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-tag-bg font-mono text-[11px] font-semibold text-tag-text">
        {String(index).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <H3>{title}</H3>
        {description && <Sub className="mt-0.5 text-[13.5px]">{description}</Sub>}
      </div>
    </div>
  );
}
