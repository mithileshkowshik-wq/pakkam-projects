import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Chip, H1, H2, Meta, SectionDivider, StatusBadge, Sub } from '@/components/ui';
import { CollaborationStyleRow } from '@/components/project/CollaborationStyleRow';
import { OwnerCard } from '@/components/project/OwnerCard';
import { ProjectUpdateList } from '@/components/project/ProjectUpdateList';
import { RoleListItem } from '@/components/project/RoleListItem';
import { RequestToCollaborateCard } from '@/components/project/RequestToCollaborateCard';
import { getProjectById, getUserByUsername } from '@/lib/mock';
import { formatRelativeDate } from '@/lib/utils';

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

  const category = project.domains[0];

  return (
    <div className="mx-auto max-w-[1080px]">
      {/* Breadcrumb */}
      <nav className="mb-5 text-[13px]">
        <Link href="/home" className="font-medium text-text-secondary hover:text-ink">
          Discover
        </Link>
        <span className="mx-2 text-text-meta">/</span>
        <span className="text-ink">{project.title}</span>
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
          </div>

          <H1 className="mb-2 mt-4 text-[32px]">{project.title}</H1>
          <Meta>
            Updated {formatRelativeDate(project.updatedAt)} · {project.viewingCount ?? 0} people
            viewing
          </Meta>

          <SectionDivider />
          <H2>About this project</H2>
          {project.description.map((paragraph, index) => (
            <Sub key={index} className="mt-3">
              {paragraph}
            </Sub>
          ))}

          <SectionDivider />
          <H2>What we&apos;re looking for</H2>
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
          <H2>Skills needed</H2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Chip key={skill.id} variant="tag">
                {skill.name}
              </Chip>
            ))}
          </div>

          <SectionDivider />
          <H2>Collaboration style</H2>
          <div className="mt-4">
            <CollaborationStyleRow
              collaborationStyle={project.collaborationStyle}
              tools={project.tools}
            />
          </div>

          <SectionDivider />
          <H2>Project updates</H2>
          <div className="mt-4">
            <ProjectUpdateList updates={project.updates} />
          </div>
        </div>

        {/* Right column */}
        <aside className="flex w-full flex-col gap-4 tablet:sticky tablet:top-6 tablet:w-[340px] tablet:flex-none">
          <OwnerCard owner={owner} />
          <RequestToCollaborateCard projectId={project.id} />
        </aside>
      </div>
    </div>
  );
}
