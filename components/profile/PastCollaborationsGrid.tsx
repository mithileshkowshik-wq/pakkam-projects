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
    <div className="mt-4 grid grid-cols-1 gap-4 tablet:grid-cols-2">
      {collaborations.map((c) => (
        <div key={`${c.title}-${c.role}`} className="group">
          {/* No cover-image field exists in the data model — the placeholder leans into the brand's
              venn-mark motif instead of pretending to be a missing photo. */}
          <div className="relative flex h-[130px] items-center justify-center overflow-hidden rounded-md border border-border-light bg-gradient-to-br from-tag-bg via-bg to-teal-bg/50 transition-shadow duration-200 group-hover:shadow-card">
            <svg width="72" height="44" viewBox="0 0 72 44" fill="none" aria-hidden className="opacity-60">
              <circle cx="26" cy="22" r="17" stroke="#F5C6C9" strokeWidth="5" />
              <circle cx="46" cy="22" r="17" stroke="#F5C6C9" strokeWidth="5" />
            </svg>
          </div>
          <H3 className="mt-2.5">{c.title}</H3>
          <Meta>Role · {c.role}</Meta>
        </div>
      ))}
    </div>
  );
}
