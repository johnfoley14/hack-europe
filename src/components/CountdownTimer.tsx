import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  deadline: Date;
  className?: string;
  variant?: 'compact' | 'full';
}

function getTimeLeft(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, totalHours: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const totalHours = diff / 3600000;
  return { days, hours, minutes, seconds, expired: false, totalHours };
}

export const CountdownTimer = ({ deadline, className, variant = 'compact' }: CountdownTimerProps) => {
  const [time, setTime] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(deadline)), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isUrgent = time.totalHours < 24 && !time.expired;

  if (time.expired) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-xs font-medium text-muted-foreground', className)}>
        <Clock className="w-3.5 h-3.5" /> Ended
      </span>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn('flex gap-3', className)}>
        {[
          { value: time.days, label: 'Days' },
          { value: time.hours, label: 'Hrs' },
          { value: time.minutes, label: 'Min' },
          { value: time.seconds, label: 'Sec' },
        ].map((unit) => (
          <div key={unit.label} className={cn(
            'flex flex-col items-center rounded-lg px-3 py-2 min-w-[52px]',
            isUrgent ? 'bg-status-ending/10 text-status-ending' : 'bg-secondary text-foreground'
          )}>
            <span className="text-xl font-bold font-display leading-none">{String(unit.value).padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1 text-muted-foreground">{unit.label}</span>
          </div>
        ))}
      </div>
    );
  }

  const label = time.days > 0 ? `${time.days}d ${time.hours}h left` : `${time.hours}h ${time.minutes}m left`;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium',
      isUrgent ? 'text-status-ending' : 'text-muted-foreground',
      className
    )}>
      <Clock className="w-3.5 h-3.5" /> {label}
    </span>
  );
};
