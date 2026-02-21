export default function StatCard({ label, value, sublabel, icon }) {
  return (
    <div className="rounded-2xl bg-white p-6 card-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone font-medium">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
          {sublabel && <p className="mt-1 text-xs text-stone">{sublabel}</p>}
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-parchment">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
