import { H3, Meta } from '@/components/ui';

export interface PastCollaboration {
  title: string;
  role: string;
}

export interface PastCollaborationsGridProps {
  collaborations: PastCollaboration[];
}

// CONTENT GAP: "past collaborations" is not in the shared lib/mock schema (frozen). Kept local to
// this screen as a placeholder — orchestrator should replace with real data when the schema grows.
export const mockPastCollaborations: PastCollaboration[] = [
  { title: 'Rhythm platformer', role: 'Gameplay Programmer' },
  { title: 'Album cover series', role: 'Illustrator' },
];

export function PastCollaborationsGrid({ collaborations }: PastCollaborationsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {collaborations.map((c) => (
        <div key={`${c.title}-${c.role}`}>
          <div className="h-[130px] bg-gradient-to-br from-tag-bg to-bg border border-border rounded-md flex items-center justify-center text-[11px] font-mono text-accent-border">
            project cover
          </div>
          <H3 className="mt-2.5">{c.title}</H3>
          <Meta>Role · {c.role}</Meta>
        </div>
      ))}
    </div>
  );
}
