import { Calendar, Circle, Clock, Globe, List, Shuffle, Users, type LucideIcon } from 'lucide-react';

import { COLLAB_STYLE_ICON } from '@/lib/constants';

export interface CollaborationStyleRowProps {
  collaborationStyle: string[];
  tools: string[];
}

// Maps the string icon names in COLLAB_STYLE_ICON to actual lucide components.
const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  clock: Clock,
  users: Users,
  calendar: Calendar,
  shuffle: Shuffle,
};

function IconLab({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-gradient-to-br from-tag-bg to-accent-border/50 text-primary ring-1 ring-inset ring-primary/10">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="text-[14px] font-medium text-ink">{label}</span>
    </div>
  );
}

export function CollaborationStyleRow({ collaborationStyle, tools }: CollaborationStyleRowProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {collaborationStyle.map((style) => (
        <IconLab key={style} icon={ICON_MAP[COLLAB_STYLE_ICON[style]] ?? Circle} label={style} />
      ))}
      {tools.length > 0 && <IconLab icon={List} label={tools.join(' + ')} />}
    </div>
  );
}
