'use client';

import { Chip, Input } from '@/components/ui';

const TOOLS = ['Notion', 'Figma', 'GitHub', 'Slack', 'Discord', 'Linear'];

export interface ToolsLinksSectionProps {
  tools: string[];
  demoLink: string;
  githubLink: string;
  toggleTool: (v: string) => void;
  setDemoLink: (v: string) => void;
  setGithubLink: (v: string) => void;
}

export function ToolsLinksSection({
  tools,
  demoLink,
  githubLink,
  toggleTool,
  setDemoLink,
  setGithubLink,
}: ToolsLinksSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Tools you use</p>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => {
            const selected = tools.includes(tool);
            return (
              <Chip
                key={tool}
                variant={selected ? 'fill' : 'default'}
                selected={selected}
                onClick={() => toggleTool(tool)}
              >
                {tool}
              </Chip>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Optional links</p>
        <div className="flex flex-col gap-2.5">
          <Input
            value={demoLink}
            onChange={(e) => setDemoLink(e.target.value)}
            placeholder="Demo link"
          />
          <Input
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="GitHub repo"
          />
        </div>
      </div>
    </div>
  );
}
