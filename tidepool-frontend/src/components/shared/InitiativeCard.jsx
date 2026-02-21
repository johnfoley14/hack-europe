import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import CountdownTimer from './CountdownTimer';

export default function InitiativeCard({ initiative, compact = false }) {
  const {
    id,
    title,
    community,
    goalCents,
    heldTotalCents,
    currency,
    status,
    pledgeCount,
    deadline,
    location,
    category,
  } = initiative;

  return (
    <Link
      to={`/initiatives/${id}`}
      className="group block overflow-hidden rounded-2xl bg-white card-shadow transition-all duration-200 hover:-translate-y-1 hover:card-shadow-hover"
    >
      <div className={compact ? 'p-5' : 'p-6'}>
        {/* Top row: category + status */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone">
            {category}
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Title */}
        <h3
          className={`font-display font-semibold text-ink line-clamp-2 group-hover:text-forest transition-colors ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          {title}
        </h3>

        {/* Community name */}
        <p className={`mt-1.5 text-stone ${compact ? 'text-xs' : 'text-sm'}`}>
          {community.name}
        </p>

        {/* Progress bar */}
        <div className={compact ? 'mt-4' : 'mt-5'}>
          <ProgressBar
            current={heldTotalCents}
            goal={goalCents}
            currency={currency}
            size="sm"
          />
        </div>

        {/* Bottom row */}
        <div className={`flex items-center justify-between ${compact ? 'mt-4' : 'mt-5'}`}>
          <div className="flex items-center gap-1.5 text-stone">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">{pledgeCount} pledges</span>
          </div>
          <CountdownTimer deadline={deadline} compact />
        </div>

        {/* Location */}
        {location && !compact && (
          <div className="mt-3 flex items-center gap-1.5 text-stone">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{location.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
