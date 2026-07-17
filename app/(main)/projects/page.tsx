import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { MyProjectRow } from '@/components/project/MyProjectRow';
import { Button, EmptyState, H1, MonoLabel } from '@/components/ui';
import { getCurrentUser, getPendingCollabRequestCounts, getProjectsByOwner } from '@/lib/data';

export default async function MyProjectsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const projects = await getProjectsByOwner(currentUser.id);
  const pendingCounts = await getPendingCollabRequestCounts(projects.map((p) => p.id));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 duration-500 ease-out-soft animate-in fade-in slide-in-from-bottom-2">
        <div>
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="h-px w-7 bg-gradient-to-r from-primary to-primary/0" />
            <MonoLabel className="text-primary">Manage</MonoLabel>
          </div>
          <H1 className="mt-2">Your projects</H1>
        </div>
        <Link href="/projects/new">
          <Button variant="primary">Post a Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Rocket className="h-5 w-5" aria-hidden />}
            heading="No projects yet"
            subtext="Post your first project and start finding collaborators."
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {projects.map((project) => (
            <MyProjectRow key={project.id} project={project} pendingRequestCount={pendingCounts[project.id] ?? 0} />
          ))}
        </div>
      )}
    </div>
  );
}
