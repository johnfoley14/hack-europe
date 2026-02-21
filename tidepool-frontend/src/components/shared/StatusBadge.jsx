const statusConfig = {
  open: {
    label: 'Active',
    dotClass: 'bg-amber',
    bgClass: 'bg-amber/10',
    textClass: 'text-amber-dark',
  },
  funded: {
    label: 'Funded',
    dotClass: 'bg-emerald',
    bgClass: 'bg-emerald/10',
    textClass: 'text-emerald',
  },
  failed: {
    label: 'Failed',
    dotClass: 'bg-red',
    bgClass: 'bg-red/10',
    textClass: 'text-red',
  },
  canceled: {
    label: 'Canceled',
    dotClass: 'bg-stone-light',
    bgClass: 'bg-stone/10',
    textClass: 'text-stone',
  },
  held: {
    label: 'Held',
    dotClass: 'bg-amber',
    bgClass: 'bg-amber/10',
    textClass: 'text-amber-dark',
  },
  captured: {
    label: 'Charged',
    dotClass: 'bg-emerald',
    bgClass: 'bg-emerald/10',
    textClass: 'text-emerald',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.textClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
