import { formatCurrency } from '../../utils/formatCurrency';

export default function ProgressBar({
  current,
  goal,
  currency = 'GBP',
  animated = false,
  size = 'md',
}) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const isFunded = current >= goal;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`relative w-full overflow-hidden rounded-full bg-sand/70 ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            animated ? 'animate-progress' : ''
          } ${isFunded ? 'bg-emerald' : 'bg-gradient-to-r from-forest to-emerald-light'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {size !== 'sm' && (
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-sm text-ink font-medium">
            {formatCurrency(current, currency)}{' '}
            <span className="text-stone font-normal">raised</span>
          </span>
          <span className="text-sm text-stone">
            {percentage}% of {formatCurrency(goal, currency)}
          </span>
        </div>
      )}
    </div>
  );
}
