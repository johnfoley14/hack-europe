import Avatar from './Avatar';

export default function AvatarStack({ names = [], max = 5, size = 'sm' }) {
  const visible = names.slice(0, max);
  const remaining = names.length - max;

  const overflowSizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
  };

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((name, i) => (
        <Avatar key={i} name={name} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`inline-flex items-center justify-center rounded-full ring-2 ring-white bg-sand font-medium text-stone ${overflowSizeClasses[size]}`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
