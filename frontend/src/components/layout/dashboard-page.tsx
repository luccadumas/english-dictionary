import { cn } from '@/lib/utils';

interface DashboardPageProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardPage({ children, className }: DashboardPageProps) {
  return <div className={cn('w-full space-y-8', className)}>{children}</div>;
}
