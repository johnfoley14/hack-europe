import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../../utils/formatTime';

export default function CountdownTimer({ deadline, compact = false }) {
  const [time, setTime] = useState(() => getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (time.expired) {
    return <span className="font-mono text-stone">Ended</span>;
  }

  const isUrgent = time.total < 60 * 60 * 1000; // less than 1 hour
  const isWarning = time.total < 24 * 60 * 60 * 1000; // less than 24 hours

  const colorClass = isUrgent
    ? 'text-red animate-urgency'
    : isWarning
      ? 'text-amber'
      : 'text-ink';

  const pad = (n) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span className={`font-mono text-sm ${colorClass}`}>
        {time.days > 0 && `${time.days}d `}
        {pad(time.hours)}h {pad(time.minutes)}m {pad(time.seconds)}s
      </span>
    );
  }

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <div className={`flex items-center gap-2 ${colorClass}`}>
      {units.map(({ value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-lg bg-white card-shadow px-3 py-2"
        >
          <span className="font-mono text-xl font-bold">{pad(value)}</span>
          <span className="text-xs text-stone">{label}</span>
        </div>
      ))}
    </div>
  );
}
