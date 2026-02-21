import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, icon, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
      {icon || <Inbox className="w-7 h-7 text-muted-foreground" />}
    </div>
    <h3 className="text-lg font-semibold font-display mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
