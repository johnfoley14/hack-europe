export default function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-parchment-dark text-stone">
          {icon}
        </div>
      )}

      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-stone">{description}</p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 rounded-lg bg-amber px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-dark"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
