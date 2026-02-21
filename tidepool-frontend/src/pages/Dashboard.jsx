import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import InitiativeCard from '../components/shared/InitiativeCard';
import EmptyState from '../components/shared/EmptyState';
import { userPledges } from '../data/pledges';
import { initiatives } from '../data/initiatives';
import { communities } from '../data/communities';
import { currentUser } from '../data/users';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeDate } from '../utils/formatTime';

export default function Dashboard() {
  const totalPledgedCents = userPledges.reduce((sum, p) => sum + p.amountCents, 0);
  const activeHoldsCount = userPledges.filter((p) => p.status === 'held').length;
  const memberCommunityCount = 3;

  const myInitiatives = initiatives.filter(
    (i) => i.id === 'init_1' || i.id === 'init_5'
  );

  const myCommunities = communities.slice(0, 3);

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink">Dashboard</h1>
        <p className="text-stone mt-2 text-lg">Welcome back, {currentUser.name}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Total Pledged"
          value={formatCurrency(totalPledgedCents)}
          icon={<Wallet className="h-5 w-5 text-forest" />}
        />
        <StatCard
          label="Active Holds"
          value={activeHoldsCount}
          icon={<ShieldCheck className="h-5 w-5 text-amber" />}
        />
        <StatCard
          label="Communities"
          value={memberCommunityCount}
          icon={<Users className="h-5 w-5 text-emerald" />}
        />
      </div>

      {/* My Pledges */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ink">My Pledges</h2>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl card-shadow divide-y divide-sand/60">
          {userPledges.map((pledge) => (
            <div
              key={pledge.id}
              className="px-6 py-5 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1 mr-6">
                <Link
                  to={`/initiatives/${pledge.initiativeId}`}
                  className="font-medium text-ink hover:text-forest transition-colors line-clamp-1"
                >
                  {pledge.initiativeTitle}
                </Link>
                <p className="text-xs text-stone mt-1">{pledge.communityName}</p>
              </div>

              <div className="font-mono text-sm text-ink mr-8 shrink-0">
                {formatCurrency(pledge.amountCents, pledge.currency)}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <StatusBadge status={pledge.status} />
                <span className="text-xs text-stone hidden sm:inline">
                  {formatRelativeDate(pledge.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Initiatives */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">My Pools</h2>

        {myInitiatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myInitiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No pools yet"
            description="Create your first pool to start collecting pledges from your community."
          />
        )}
      </section>

      {/* My Communities */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          My Communities
        </h2>

        <div className="bg-white rounded-2xl card-shadow divide-y divide-sand/60">
          {myCommunities.map((community) => (
            <div
              key={community.id}
              className="px-6 py-5 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1 mr-6">
                <Link
                  to={`/communities/${community.id}`}
                  className="font-medium text-ink hover:text-forest transition-colors"
                >
                  {community.name}
                </Link>
                <p className="text-xs text-stone line-clamp-1 mt-1">
                  {community.description}
                </p>
              </div>

              <div className="text-sm text-stone mr-6 shrink-0 hidden sm:block">
                {community.memberCount} members
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="bg-parchment text-forest text-xs font-medium rounded-full px-3 py-1">
                  {community.activePoolCount} active
                </span>
                <Link to={`/communities/${community.id}`}>
                  <ArrowRight className="h-4 w-4 text-stone hover:text-forest transition-colors" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
