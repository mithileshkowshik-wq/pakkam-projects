import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import { Chip, H1, H2, Meta, SectionDivider, StatusBadge } from '@/components/ui';
import { CollaborationStyleRow } from '@/components/project/CollaborationStyleRow';
import { IncomingRequestsCard } from '@/components/project/IncomingRequestsCard';
import { OwnerCard } from '@/components/project/OwnerCard';
import { ProjectUpdateList } from '@/components/project/ProjectUpdateList';
import { RoleListItem } from '@/components/project/RoleListItem';
import { RequestToCollaborateCard } from '@/components/project/RequestToCollaborateCard';
import { TeamMembersCard } from '@/components/project/TeamMembersCard';
import { getCurrentUser, getProjectById, getUserByUsername } from '@/lib/data';
import { formatRelativeDate } from '@/lib/utils';

import { getMyCollabRequestStatus, getPendingCollabRequests } from './actions';

/** Section heading with the brand's coral tick — shared across the detail page's left column. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className="h-[18px] w-1 flex-none rounded-full bg-brand-gradient" />
      <H2>{children}</H2>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);
  if (!project) notFound();

  // OwnerCard needs the owner's `skills`, which Project.owner omits — look up the full User.
  const ownerRecord = await getUserByUsername(project.owner.username);
  const owner = ownerRecord ?? { ...project.owner, skills: [] };

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === project.ownerId;

  const category = project.domains[0];

  return (
    <div className="mx-auto max-w-[1080px] duration-500 ease-out-soft animate-in fade-in slide-in-from-bottom-2">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-meta">
        <Link
          href="/home"
          className="font-medium text-text-secondary transition-colors hover:text-primary"
        >
          Discover
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-text-meta" aria-hidden />
        <span className="truncate font-medium text-ink">{project.title}</span>
      </nav>

      {/* <768px: content + right panel stack to a single column; ≥768px keep the two-column layout. */}
      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-start">
        {/* Left column */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {category && (
              <Chip variant="tag" size="sm">
                {category.emoji} {category.name}
              </Chip>
            )}
            <StatusBadge stage={project.stage} />
            {project.isOpenToCollabs && (
              <Chip variant="tag" size="sm">
                Open to collaborators
              </Chip>
            )}
          </div>

          <H1 className="mb-2 mt-4 text-[32px]">{project.title}</H1>
          <Meta>Updated {formatRelativeDate(project.updatedAt)}</Meta>

          <SectionDivider />
          <SectionHeading>About this project</SectionHeading>
          {/* Sanitized once at the write boundary (lib/sanitizeHtml.ts) — safe to render
              directly here, not re-sanitized on every read. */}
          <div
            className="mt-3 text-[14.5px] leading-[1.55] text-text-secondary [&_li]:ml-5 [&_p+p]:mt-3 [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />

          <SectionDivider />
          <SectionHeading>What we&apos;re looking for</SectionHeading>
          <div className="mt-4 flex flex-col gap-3.5">
            {project.roles.map((role, index) => (
              <RoleListItem
                key={role.id}
                index={index + 1}
                title={role.title}
                description={role.description}
              />
            ))}
          </div>

          <SectionDivider />
          <SectionHeading>Skills needed</SectionHeading>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Chip key={skill.id} variant="tag">
                {skill.name}
              </Chip>
            ))}
          </div>

          <SectionDivider />
          <SectionHeading>Collaboration style</SectionHeading>
          <div className="mt-4">
            <CollaborationStyleRow
              collaborationStyle={project.collaborationStyle}
              tools={project.tools}
            />
          </div>

          <SectionDivider />
          <SectionHeading>Project updates</SectionHeading>
          <div className="mt-4">
            <ProjectUpdateList updates={project.updates} />
          </div>
        </div>

        {/* Right column */}
        <aside className="flex w-full flex-col gap-4 tablet:sticky tablet:top-6 tablet:w-[340px] tablet:flex-none">
          <OwnerCard owner={owner} />
          <TeamMembersCard collaborators={project.collaborators ?? []} />
          {isOwner ? (
            <IncomingRequestsCard requests={await getPendingCollabRequests(project.id)} />
          ) : currentUser ? (
            <RequestToCollaborateCard
              projectId={project.id}
              initialStatus={await getMyCollabRequestStatus(project.id, currentUser.id)}
            />
          ) : null}
        </aside>
      </div>
    </div>
  );
}
