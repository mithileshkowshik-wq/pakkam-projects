'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { Domain, Skill } from '@/lib/data';
import { Button, Card, H1, Meta, SectionDivider, Sub } from '@/components/ui';

import { usePostProjectForm } from '@/hooks/usePostProjectForm';

import { createProject } from '@/app/(main)/projects/new/actions';
import { BasicsSection } from './BasicsSection';
import { DescriptionSection } from './DescriptionSection';
import { LookingForSection } from './LookingForSection';
import { SectionLabel } from './SectionLabel';
import { SubmitBar } from './SubmitBar';
import { ToolsLinksSection } from './ToolsLinksSection';
import { VisibilitySection } from './VisibilitySection';

export interface PostProjectFormProps {
  domains: Domain[];
  skills: Skill[];
}

export function PostProjectForm({ domains, skills }: PostProjectFormProps) {
  const form = usePostProjectForm();
  const { state } = form;
  const [publishing, setPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    const result = await createProject(state);
    setPublishing(false);
    if (result.ok && result.projectId) {
      setPublishedId(result.projectId);
    } else {
      setPublishError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-[660px]">
      {publishedId && (
        <Card accent className="mb-6">
          <p className="text-[15px] font-semibold text-ink">🎉 Project published!</p>
          <Sub className="mt-1">Your project is live and visible on the discovery feed.</Sub>
          <Link href={`/projects/${publishedId}`} className="mt-4 inline-block">
            <Button variant="primary">View your project</Button>
          </Link>
        </Card>
      )}
      {publishError && (
        <Card className="mb-6 border-primary/40">
          <Meta className="text-primary">{publishError}</Meta>
        </Card>
      )}

      <header className="mb-8">
        <H1>Post a project</H1>
        <Sub className="mt-2">
          Share what you&apos;re building and the kind of people you&apos;d love to build it with.
        </Sub>
      </header>

      <section>
        <SectionLabel number="01" label="The basics" />
        <BasicsSection
          title={state.title}
          pitch={state.pitch}
          categoryDomainId={state.categoryDomainId}
          stage={state.stage}
          domains={domains}
          setTitle={form.setTitle}
          setPitch={form.setPitch}
          setCategory={form.setCategory}
          setStage={form.setStage}
        />
      </section>

      <SectionDivider />

      <section>
        <SectionLabel number="02" label="Description" />
        <DescriptionSection
          description={state.description}
          setDescription={form.setDescription}
        />
      </section>

      <SectionDivider />

      <section>
        <SectionLabel number="03" label="What you're looking for" />
        <LookingForSection
          roles={state.roles}
          skillsNeeded={state.skillsNeeded}
          commitment={state.commitment}
          collaborationStyle={state.collaborationStyle}
          skills={skills}
          addRole={form.addRole}
          removeRole={form.removeRole}
          updateRole={form.updateRole}
          setSkillsNeeded={form.setSkillsNeeded}
          setCommitment={form.setCommitment}
          toggleCollaborationStyle={form.toggleCollaborationStyle}
        />
      </section>

      <SectionDivider />

      <section>
        <SectionLabel number="04" label="Tools & links" />
        <ToolsLinksSection
          tools={state.tools}
          demoLink={state.demoLink}
          githubLink={state.githubLink}
          toggleTool={form.toggleTool}
          setDemoLink={form.setDemoLink}
          setGithubLink={form.setGithubLink}
        />
      </section>

      <SectionDivider />

      <section>
        <SectionLabel number="05" label="Visibility" />
        <VisibilitySection
          openToCollaborators={state.openToCollaborators}
          whoCanApply={state.whoCanApply}
          setOpenToCollaborators={form.setOpenToCollaborators}
          setWhoCanApply={form.setWhoCanApply}
        />
      </section>

      <SubmitBar
        draftSavedAt={state.draftSavedAt}
        onSaveDraft={form.markDraftSaved}
        onPublish={handlePublish}
        publishing={publishing}
      />
    </div>
  );
}
