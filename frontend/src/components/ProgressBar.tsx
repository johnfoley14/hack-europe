import { cn } from '@/lib/utils';
import type { InitiativeStatus } from '@/lib/types';

interface ProgressBarProps {
  current: number;
  goal: number;
  status: InitiativeStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusBarColors: Record<InitiativeStatus, string> = {
  open: 'bg-primary',
  funded: 'bg-success',
  failed: 'bg-destructive/60',
  canceled: 'bg-muted-foreground/40',
};

export const ProgressBar = ({ current, goal, status, size = 'md', showLabel = true, className }: ProgressBarProps) => {
  const percent = Math.min(100, Math.round((current / goal) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-secondary overflow-hidden', heights[size])}>
        <div
          className={cn('rounded-full progress-bar-fill', heights[size], statusBarColors[status])}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span className="font-medium">£{current.toLocaleString()} held</span>
          <span>{percent}%</span>
        </div>
      )}
    </div>
  );
};
