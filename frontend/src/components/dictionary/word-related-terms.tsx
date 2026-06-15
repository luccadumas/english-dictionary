import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WordRelatedTermsProps {
  label: string;
  terms: string[];
  variant?: 'synonym' | 'antonym';
  maxItems?: number;
}

export function WordRelatedTerms({
  label,
  terms,
  variant = 'synonym',
  maxItems = 8,
}: WordRelatedTermsProps) {
  if (terms.length === 0) return null;

  const visibleTerms = terms.slice(0, maxItems);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id={`${label}-label`} className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <ul className="flex flex-wrap items-center gap-2" aria-labelledby={`${label}-label`}>
        {visibleTerms.map((term) => (
          <li key={term}>
            <Link
              href={`/words/${term}`}
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Badge
                variant="outline"
                className={cn(
                  variant === 'antonym' && 'border-destructive/30 text-destructive',
                )}
              >
                {term}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
