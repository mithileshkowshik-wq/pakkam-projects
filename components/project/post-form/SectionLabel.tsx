export interface SectionLabelProps {
  number: string;
  label: string;
}

// .seclab: mono, uppercase, letter-spaced; the number in coral, the rest in meta grey.
export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-meta">
      <span className="text-primary">{number}</span> {label}
    </p>
  );
}
