import { cn } from '@/lib/utils';
import type { InitiativeStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: InitiativeStatus;
  endingSoon?: boolean;
  className?: string;
}

const statusConfig: Record<InitiativeStatus | 'ending', { label: string; classes: string }> = {
  open: { label: 'Open', classes: 'bg-status-open text-status-open-foreground' },
  funded: { label: 'Funded', classes: 'bg-status-funded text-status-funded-foreground' },
  failed: { label: 'Failed', classes: 'bg-status-failed text-status-failed-foreground' },
  canceled: { label: 'Canceled', classes: 'bg-muted text-muted-foreground' },
  ending: { label: 'Ending Soon', classes: 'bg-status-ending text-status-ending-foreground' },
};

export const StatusBadge = ({ status, endingSoon, className }: StatusBadgeProps) => {
  const key = status === 'open' && endingSoon ? 'ending' : status;
  const config = statusConfig[key];

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase',
      config.classes,
      className
    )}>
      {config.label}
    </span>
  );
};
