'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button, Card, H1, SectionDivider, Sub } from '@/components/ui';

import { usePostProjectForm } from '@/hooks/usePostProjectForm';

import { BasicsSection } from './BasicsSection';
import { DescriptionSection } from './DescriptionSection';
import { LookingForSection } from './LookingForSection';
import { SectionLabel } from './SectionLabel';
import { SubmitBar } from './SubmitBar';
import { ToolsLinksSection } from './ToolsLinksSection';
import { VisibilitySection } from './VisibilitySection';

export function PostProjectForm() {
  const form = usePostProjectForm();
  const { state } = form;
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    // Mock publish: no backend yet, so we just simulate latency then show inline success.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPublishing(false);
    setPublished(true);
  };

  return (
    <div className="mx-auto max-w-[660px]">
      {published && (
        <Card accent className="mb-6">
          <p className="text-[15px] font-semibold text-ink">🎉 Project published!</p>
          <Sub className="mt-1">
            This is a mock — nothing is actually saved or persisted anywhere yet; the backend phase
            will wire this up for real.
          </Sub>
          <Link href="/home" className="mt-4 inline-block">
            <Button variant="primary">Back to home</Button>
          </Link>
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
