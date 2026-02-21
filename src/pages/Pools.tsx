import { useState } from 'react';
import { mockInitiatives, type InitiativeStatus } from '@/lib/mock-data';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import { Search, MapPin, Users, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const filterTabs: { label: string; value: 'all' | InitiativeStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Funded', value: 'funded' },
  { label: 'Failed', value: 'failed' },
];

const statusLabel: Record<string, string> = {
  open: 'Collecting',
  funded: 'Funded',
  failed: 'Expired',
  canceled: 'Canceled',
};

const statusDot: Record<string, string> = {
  open: 'bg-primary',
  funded: 'bg-success',
  failed: 'bg-destructive',
  canceled: 'bg-muted-foreground',
};

function CircularProgress({ percent, status, size = 64 }: { percent: number; status: string; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const strokeColor = status === 'funded'
    ? 'hsl(var(--success))'
    : status === 'failed'
      ? 'hsl(var(--destructive))'
      : 'hsl(var(--primary))';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-display text-foreground">
        {percent}%
      </span>
    </div>
  );
}

function getTimeLabel(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

const Pools = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | InitiativeStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = mockInitiatives
    .filter((i) => activeFilter === 'all' || i.status === activeFilter)
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  // Feature the open pool with the most backers that hasn't hit its goal
  const featured = filtered
    .filter((i) => i.status === 'open' && i.heldAmount < i.goalAmount)
    .sort((a, b) => b.pledgeCount - a.pledgeCount)[0] ?? filtered[0];
  const rest = filtered.filter((i) => i !== featured);

  return (
    <div className="min-h-screen">
      <section className="container py-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Explore</p>
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground leading-none">
              Pools
            </h1>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Filters as underline tabs */}
        <div className="flex items-center gap-6 border-b border-border mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'relative pb-3 text-sm font-medium transition-colors',
                activeFilter === tab.value
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {activeFilter === tab.value && (
                <motion.div
                  layoutId="pools-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
          <span className="ml-auto pb-3 text-xs text-muted-foreground">
            {filtered.length} pool{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState
              title="No pools found"
              description="There are no pools matching your filters right now."
            />
          ) : (
            <motion.div
              key={activeFilter + search}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Featured pool — wide card */}
              {featured && (
                <Link to={`/initiative/${featured.id}`} className="group block mb-6">
                  <div className="relative rounded-2xl border border-border bg-card overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:border-primary/30 transition-colors">
                    {/* Left — info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={cn('w-2 h-2 rounded-full', statusDot[featured.status])} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {statusLabel[featured.status]}
                        </span>
                        <span className="text-xs text-muted-foreground/50">·</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {getTimeLabel(featured.deadline)}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground group-hover:text-primary transition-colors mb-3 leading-tight">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                        {featured.description}
                      </p>

                      <div className="flex items-center gap-5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {featured.location.address}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {featured.pledgeCount} pledges
                        </span>
                      </div>
                    </div>

                    {/* Right — circular progress + amount */}
                    <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3 md:min-w-[120px] md:justify-center">
                      <CircularProgress
                        percent={Math.min(100, Math.round((featured.heldAmount / featured.goalAmount) * 100))}
                        status={featured.status}
                        size={80}
                      />
                      <div className="text-center">
                        <p className="text-lg font-bold font-display text-foreground">
                          £{featured.heldAmount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          of £{featured.goalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="absolute top-5 right-5 w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )}

              {/* Rest — compact list rows */}
              <div className="flex flex-col gap-1">
                {rest.map((initiative, i) => {
                  const percent = Math.min(100, Math.round((initiative.heldAmount / initiative.goalAmount) * 100));
                  return (
                    <Link
                      key={initiative.id}
                      to={`/initiative/${initiative.id}`}
                      className="group flex items-center gap-4 md:gap-6 rounded-xl px-4 md:px-6 py-4 hover:bg-card border border-transparent hover:border-border transition-all"
                    >
                      {/* Index */}
                      <span className="hidden md:block text-xs font-mono text-muted-foreground/40 w-5 text-right">
                        {String(i + 2).padStart(2, '0')}
                      </span>

                      {/* Status dot */}
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', statusDot[initiative.status])} />

                      {/* Title + location */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold font-display text-foreground group-hover:text-primary transition-colors truncate">
                          {initiative.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {initiative.location.address}
                        </p>
                      </div>

                      {/* Pledges */}
                      <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Users className="w-3 h-3" /> {initiative.pledgeCount}
                      </span>

                      {/* Amount + progress */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold font-display text-foreground">
                            £{initiative.heldAmount.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            of £{initiative.goalAmount.toLocaleString()}
                          </p>
                        </div>
                        <CircularProgress percent={percent} status={initiative.status} size={40} />
                      </div>

                      {/* Time */}
                      <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground shrink-0 min-w-[60px] justify-end">
                        <Clock className="w-3 h-3" /> {getTimeLabel(initiative.deadline)}
                      </span>

                      <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Pools;
