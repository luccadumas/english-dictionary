interface SectionTitleProps {
  id?: string;
  children: React.ReactNode;
}

export function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground"
    >
      {children}
    </h2>
  );
}
