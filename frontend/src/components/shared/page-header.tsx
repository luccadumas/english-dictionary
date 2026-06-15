interface PageHeaderProps {
  title: string;
  description?: string;
  meta?: string;
}

export function PageHeader({ title, description, meta }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        <span className="brand-text-gradient">{title}</span>
      </h1>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {meta && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {meta}
        </p>
      )}
    </header>
  );
}
