import { Link } from 'react-router-dom';
import {
  Activity,
  DollarSign,
  Landmark,
  Users,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import { initiatives } from '../data/initiatives';
import { adminEvents } from '../data/events';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeDate } from '../utils/formatTime';

const eventDotColors = {
  pledge_authorized: 'bg-amber',
  initiative_funded: 'bg-emerald',
  pledge_captured: 'bg-emerald',
  pledge_canceled: 'bg-stone',
  initiative_failed: 'bg-red',
  initiative_created: 'bg-forest',
};

function formatEventTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatRelativeDate(timestamp);
}

export default function Admin() {
  const totalInitiatives = initiatives.length;
  const totalHeldCents = initiatives
    .filter((i) => i.status === 'open')
    .reduce((sum, i) => sum + i.heldTotalCents, 0);
  const totalCapturedCents = initiatives.reduce(
    (sum, i) => sum + i.capturedTotalCents,
    0
  );
  const activeCommunities = 4;

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink">Admin</h1>
        <p className="text-stone mt-2 text-lg">Platform overview and management</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Initiatives"
          value={totalInitiatives}
          icon={<Activity className="h-5 w-5 text-forest" />}
        />
        <StatCard
          label="Total Held"
          value={formatCurrency(totalHeldCents)}
          icon={<DollarSign className="h-5 w-5 text-amber" />}
        />
        <StatCard
          label="Total Captured"
          value={formatCurrency(totalCapturedCents)}
          icon={<Landmark className="h-5 w-5 text-emerald" />}
        />
        <StatCard
          label="Active Communities"
          value={activeCommunities}
          icon={<Users className="h-5 w-5 text-stone" />}
        />
      </div>

      {/* Initiatives table */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          All Initiatives ({initiatives.length})
        </h2>

        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-parchment text-xs uppercase tracking-wider text-stone">
                  <th className="text-left px-6 py-4 font-semibold">Name</th>
                  <th className="text-left px-5 py-4 font-semibold">Community</th>
                  <th className="text-left px-5 py-4 font-semibold">Status</th>
                  <th className="text-right px-5 py-4 font-semibold">Goal</th>
                  <th className="text-right px-5 py-4 font-semibold">Held</th>
                  <th className="text-left px-5 py-4 font-semibold">Deadline</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60">
                {initiatives.map((initiative) => {
                  const heldPercent =
                    initiative.goalCents > 0
                      ? initiative.heldTotalCents / initiative.goalCents
                      : 0;

                  const heldColor =
                    heldPercent > 0.75
                      ? 'text-emerald'
                      : heldPercent > 0.5
                        ? 'text-amber'
                        : 'text-ink';

                  const deadlineDate = new Date(initiative.deadline);
                  const isPast = deadlineDate < new Date();

                  return (
                    <tr key={initiative.id} className="hover:bg-parchment/40 transition-colors">
                      <td className="px-6 py-5">
                        <Link
                          to={`/initiatives/${initiative.id}`}
                          className="font-medium text-ink hover:text-forest transition-colors line-clamp-1"
                        >
                          {initiative.title}
                        </Link>
                      </td>
                      <td className="px-5 py-5 text-sm text-stone">
                        {initiative.community.name}
                      </td>
                      <td className="px-5 py-5">
                        <StatusBadge status={initiative.status} />
                      </td>
                      <td className="px-5 py-5 text-right font-mono text-sm text-ink">
                        {formatCurrency(initiative.goalCents, initiative.currency)}
                      </td>
                      <td className={`px-5 py-5 text-right font-mono text-sm ${heldColor}`}>
                        {formatCurrency(initiative.heldTotalCents, initiative.currency)}
                      </td>
                      <td className="px-5 py-5 text-sm text-stone">
                        {isPast ? 'Ended' : formatRelativeDate(initiative.deadline)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {initiative.status === 'open' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-xs bg-emerald/10 text-emerald rounded-lg px-3 py-1.5 hover:bg-emerald/20 transition-colors font-semibold">
                              Capture
                            </button>
                            <button className="text-xs bg-red/10 text-red rounded-lg px-3 py-1.5 hover:bg-red/20 transition-colors font-semibold">
                              Fail
                            </button>
                          </div>
                        ) : (
                          <span className="text-stone">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Activity log */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          Recent Activity
        </h2>

        <div className="bg-white rounded-2xl card-shadow p-6 lg:p-8">
          {adminEvents.map((event, index) => {
            const dotColor = eventDotColors[event.type] || 'bg-stone';

            return (
              <div
                key={event.id}
                className={`flex items-center py-4 ${
                  index < adminEvents.length - 1 ? 'border-b border-sand/60' : ''
                }`}
              >
                <div className="shrink-0 mr-4">
                  <span className={`block h-2.5 w-2.5 rounded-full ${dotColor}`} />
                </div>

                <p className="text-sm text-ink flex-1 min-w-0">{event.message}</p>

                <span className="text-xs text-stone font-mono shrink-0 ml-6">
                  {formatEventTime(event.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
}
