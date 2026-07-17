import { ChevronRight, Eye, Inbox } from 'lucide-react';
import Link from 'next/link';

import type { Project } from '@/lib/mock/types';
import { formatRelativeDate } from '@/lib/utils';
import { Card, Chip, Meta, StatusBadge } from '@/components/ui';

export interface MyProjectRowProps {
  project: Pick<Project, 'id' | 'title' | 'pitch' | 'stage' | 'updatedAt' | 'viewingCount'>;
  pendingRequestCount: number;
}

// Denser than ProjectCard's discovery-feed treatment: this is a management list, not a feed, and
// carries data (pending-request count) ProjectCard's prop surface doesn't.
export function MyProjectRow({ project, pendingRequestCount }: MyProjectRowProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="flex flex-col gap-3 transition-all duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:border-accent-border group-hover:shadow-card-hover tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge stage={project.stage} />
            <Meta className="text-text-meta">Updated {formatRelativeDate(project.updatedAt)}</Meta>
          </div>
          <h3 className="mt-2 truncate font-display text-[17px] font-bold tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-primary-hover">
            {project.title}
          </h3>
          <Meta className="mt-0.5 line-clamp-1 text-text-secondary">{project.pitch}</Meta>
        </div>

        <div className="flex flex-none items-center gap-4 tablet:gap-5">
          <span className="inline-flex items-center gap-1.5 text-meta text-text-meta">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {project.viewingCount ?? 0} viewing
          </span>
          {pendingRequestCount > 0 && (
            <Chip variant="fill" size="sm" className="inline-flex items-center gap-1">
              <Inbox className="h-3 w-3" aria-hidden />
              {pendingRequestCount} pending {pendingRequestCount === 1 ? 'request' : 'requests'}
            </Chip>
          )}
          <ChevronRight
            className="hidden h-4 w-4 text-text-meta transition-all duration-200 ease-out-soft group-hover:translate-x-0.5 group-hover:text-primary tablet:block"
            aria-hidden
          />
        </div>
      </Card>
    </Link>
  );
}
