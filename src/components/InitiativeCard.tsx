import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Initiative } from '@/lib/mock-data';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { CountdownTimer } from './CountdownTimer';

interface InitiativeCardProps {
  initiative: Initiative;
  className?: string;
}

export const InitiativeCard = ({ initiative, className }: InitiativeCardProps) => {
  const { id, title, description, goalAmount, heldAmount, deadline, location, organizer, status, pledgeCount } = initiative;
  const hoursLeft = (deadline.getTime() - Date.now()) / 3600000;
  const endingSoon = status === 'open' && hoursLeft > 0 && hoursLeft < 24;

  return (
    <Link
      to={`/initiative/${id}`}
      className={cn(
        'group block rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border/50',
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <StatusBadge status={status} endingSoon={endingSoon} />
          <CountdownTimer deadline={deadline} />
        </div>

        <h3 className="text-lg font-semibold font-display text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        <ProgressBar current={heldAmount} goal={goalAmount} status={status} size="sm" />

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{location.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{pledgeCount} pledges</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
