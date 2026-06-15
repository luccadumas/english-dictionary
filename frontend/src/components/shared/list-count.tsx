interface ListCountProps {
  count: number;
  singular: string;
  plural: string;
}

export function ListCount({ count, singular, plural }: ListCountProps) {
  if (count <= 0) return null;

  return (
    <p className="text-sm text-muted-foreground" aria-live="polite">
      {count.toLocaleString()} {count === 1 ? singular : plural}
    </p>
  );
}
