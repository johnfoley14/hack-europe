const bgColors = [
  'bg-forest',
  'bg-amber-dark',
  'bg-stone',
  'bg-emerald',
  'bg-forest-light',
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = getInitials(name);
  const colorIndex = hashName(name) % bgColors.length;
  const bgColor = bgColors[colorIndex];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ring-2 ring-white font-medium text-white ${bgColor} ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
