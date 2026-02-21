import { useState, useRef, useCallback, useMemo } from 'react';
import { Search, Globe2, LayoutGrid, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import Globe from '../components/globe/Globe';
import InitiativeCard from '../components/shared/InitiativeCard';
import { initiatives } from '../data/initiatives';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Active' },
  { key: 'funded', label: 'Funded' },
  { key: 'failed', label: 'Failed' },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortByDeadline, setSortByDeadline] = useState(false);
  const [viewMode, setViewMode] = useState('globe');
  const [highlightedId, setHighlightedId] = useState(null);
  const cardRefs = useRef({});
  const sidebarRef = useRef(null);

  const filteredInitiatives = useMemo(() => {
    let result = [...initiatives];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((i) => i.title.toLowerCase().includes(query));
    }

    if (statusFilter !== 'all') {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (sortByDeadline) {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    return result;
  }, [searchQuery, statusFilter, sortByDeadline]);

  const handlePinClick = useCallback((initiative) => {
    setHighlightedId(initiative.id);

    const cardEl = cardRefs.current[initiative.id];
    if (cardEl && sidebarRef.current) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => setHighlightedId(null), 2000);
  }, []);

  return (
    <PageLayout fullWidth>
      <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Globe / Grid — fills entire background */}
        <div className="absolute inset-0 bg-parchment-dark">
          <AnimatePresence mode="wait">
            {viewMode === 'globe' ? (
              <motion.div
                key="globe"
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Globe
                  initiatives={initiatives}
                  onPinClick={handlePinClick}
                />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="w-full h-full overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8 pl-8 lg:pl-[26rem]">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredInitiatives.map((initiative) => (
                      <InitiativeCard key={initiative.id} initiative={initiative} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View toggle — top right */}
        <div className="absolute top-5 right-5 z-20 flex bg-white rounded-xl card-shadow p-1.5 gap-1">
          <button
            onClick={() => setViewMode('globe')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'globe'
                ? 'bg-forest text-white'
                : 'text-stone hover:text-ink hover:bg-parchment'
            }`}
            title="3D Globe view"
          >
            <Globe2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-forest text-white'
                : 'text-stone hover:text-ink hover:bg-parchment'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="absolute left-0 top-0 bottom-0 w-full lg:w-[380px] bg-white/95 backdrop-blur-xl border-r border-sand/60 overflow-y-auto z-10"
        >
          <div className="p-6 lg:p-7">
            {/* Header */}
            <h1 className="font-display text-2xl font-bold text-ink">
              Explore Pools
            </h1>
            <p className="text-stone text-sm mt-1">
              Discover initiatives around the world
            </p>

            {/* Search input */}
            <div className="relative mt-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
              <input
                type="text"
                placeholder="Search initiatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-sand rounded-xl pl-10 pr-10 py-3 text-sm text-ink placeholder:text-stone-light bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone hover:text-ink transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status filter pills */}
            <div className="mt-5">
              <p className="text-xs font-medium text-stone mb-2.5">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      statusFilter === filter.key
                        ? 'bg-forest text-white'
                        : 'bg-parchment text-stone hover:bg-sand'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ending Soon toggle */}
            <button
              onClick={() => setSortByDeadline(!sortByDeadline)}
              className={`mt-5 w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-colors ${
                sortByDeadline
                  ? 'bg-amber/10 text-amber-dark font-medium'
                  : 'text-stone hover:bg-parchment'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Ending Soon</span>
              {sortByDeadline && (
                <span className="ml-auto text-xs bg-amber/20 text-amber-dark rounded-full px-2.5 py-0.5">
                  On
                </span>
              )}
            </button>

            {/* Divider + Results count */}
            <div className="border-t border-sand mt-5 pt-5">
              <p className="text-xs text-stone">
                {filteredInitiatives.length} pool{filteredInitiatives.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Initiative list */}
            <div className="mt-4 flex flex-col gap-3">
              {filteredInitiatives.map((initiative) => (
                <div
                  key={initiative.id}
                  ref={(el) => { cardRefs.current[initiative.id] = el; }}
                  className={`transition-all duration-500 rounded-xl ${
                    highlightedId === initiative.id
                      ? 'ring-2 ring-amber ring-offset-2'
                      : ''
                  }`}
                >
                  <InitiativeCard initiative={initiative} compact />
                </div>
              ))}

              {filteredInitiatives.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-stone text-sm">No pools match your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setSortByDeadline(false);
                    }}
                    className="mt-3 text-forest text-sm font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
