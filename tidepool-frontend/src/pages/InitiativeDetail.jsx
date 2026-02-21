import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Share2, Copy, Check } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatusBadge from '../components/shared/StatusBadge';
import ProgressBar from '../components/shared/ProgressBar';
import CountdownTimer from '../components/shared/CountdownTimer';
import Avatar from '../components/shared/Avatar';
import AvatarStack from '../components/shared/AvatarStack';
import PledgeModal from '../components/pledge/PledgeModal';
import { initiatives } from '../data/initiatives';
import { formatDate, formatRelativeDate } from '../utils/formatTime';
import { formatCurrency } from '../utils/formatCurrency';

const mockPledgerNames = [
  'Emma Thompson',
  'Raj Gupta',
  'Lucy Williams',
  'Ben Clarke',
  'Sofia Andersson',
  'Mo Hassan',
  'Kate O\'Brien',
  'Jake Turner',
];

export default function InitiativeDetail() {
  const { id } = useParams();
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const initiative = initiatives.find((i) => i.id === id);

  if (!initiative) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <h1 className="font-display text-2xl font-bold text-ink">Pool not found</h1>
          <p className="text-stone mt-3">The pool you are looking for does not exist.</p>
          <Link to="/explore" className="inline-block mt-6 text-forest font-medium hover:underline">
            Browse all pools
          </Link>
        </div>
      </PageLayout>
    );
  }

  const {
    title,
    description,
    community,
    organizer,
    goalCents,
    heldTotalCents,
    currency,
    status,
    pledgeCount,
    deadline,
    createdAt,
    location,
    category,
    updates,
  } = initiative;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const renderPledgeButton = () => {
    if (status === 'funded') {
      return (
        <button
          disabled
          className="w-full py-4 bg-emerald text-white rounded-xl font-display text-lg font-semibold cursor-not-allowed opacity-80"
        >
          This pool was funded
        </button>
      );
    }
    if (status === 'failed') {
      return (
        <button
          disabled
          className="w-full py-4 bg-stone text-white rounded-xl font-display text-lg font-semibold cursor-not-allowed opacity-80"
        >
          This pool didn't reach its goal
        </button>
      );
    }
    return (
      <>
        <button
          onClick={() => setPledgeModalOpen(true)}
          className="w-full py-4 bg-amber hover:bg-amber-dark text-white rounded-xl font-display text-lg font-semibold transition-all hover:-translate-y-0.5 card-shadow"
        >
          Pledge to this Pool
        </button>
        <p className="text-xs text-stone text-center mt-3">
          Your card will be held, not charged
        </p>
      </>
    );
  };

  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="text-sm text-stone mb-8 flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-forest transition-colors">
              Home
            </Link>
            <span className="text-sand-dark">/</span>
            <Link
              to={`/communities/${community.id}`}
              className="hover:text-forest transition-colors"
            >
              {community.name}
            </Link>
            <span className="text-sand-dark">/</span>
            <span className="text-ink">{title}</span>
          </nav>

          {/* Title section */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-parchment-dark text-stone px-3 py-1 rounded-full">
                {category}
              </span>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink mt-4 leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-stone text-sm mt-3 flex-wrap">
                <Link
                  to={`/communities/${community.id}`}
                  className="hover:text-forest transition-colors"
                >
                  {community.name}
                </Link>
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {location.name}
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Progress section */}
          <div className="mt-10">
            <ProgressBar
              current={heldTotalCents}
              goal={goalCents}
              currency={currency}
              size="lg"
              animated
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-stone text-sm">
                <Users className="h-4 w-4" />
                <span>{pledgeCount} people have pledged</span>
              </div>
              <CountdownTimer deadline={deadline} compact />
            </div>
          </div>

          {/* Pledge CTA */}
          <div className="mt-8">{renderPledgeButton()}</div>

          {/* Description */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">About this pool</h2>
            <p className="whitespace-pre-line text-stone leading-relaxed mt-4 text-[15px]">
              {description}
            </p>
          </div>

          {/* Updates */}
          {updates && updates.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-display text-xl font-semibold text-ink">Updates</h2>
                <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-full bg-parchment-dark text-stone text-xs font-medium px-2">
                  {updates.length}
                </span>
              </div>
              <div className="relative pl-7">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 border-l-2 border-sand" />

                <div className="space-y-8">
                  {[...updates].reverse().map((update, index) => (
                    <div key={index} className="relative">
                      {/* Dot */}
                      <div className="absolute -left-7 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-forest" />
                      <div>
                        <span className="font-mono text-xs text-stone">
                          {formatRelativeDate(update.date)}
                        </span>
                        <p className="text-ink mt-2 text-sm leading-relaxed">{update.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pledgers */}
          <div className="mt-10">
            <div className="flex items-center gap-4">
              <AvatarStack names={mockPledgerNames} max={5} size="sm" />
              {pledgeCount > 5 && (
                <span className="text-sm text-stone">and {pledgeCount - 5} others</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-5">
            {/* Organizer card */}
            <div className="bg-white rounded-2xl card-shadow p-7">
              <span className="text-xs uppercase tracking-wider text-stone font-semibold">
                Organizer
              </span>
              <div className="flex items-center gap-4 mt-4">
                <Avatar name={organizer.name} size="md" />
                <div>
                  <p className="font-semibold text-ink">{organizer.name}</p>
                  <span className="inline-block text-xs bg-parchment text-stone px-2.5 py-0.5 rounded-full mt-1">
                    Organizer
                  </span>
                </div>
              </div>

              <div className="border-t border-sand my-5" />

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block mb-1.5">
                    Community
                  </span>
                  <Link
                    to={`/communities/${community.id}`}
                    className="text-ink hover:text-forest transition-colors"
                  >
                    {community.name}
                  </Link>
                </div>

                {location && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-stone font-semibold block mb-1.5">
                      Location
                    </span>
                    <span className="flex items-center gap-1.5 text-ink">
                      <MapPin className="h-3.5 w-3.5 text-stone" />
                      {location.name}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block mb-1.5">
                    Created
                  </span>
                  <span className="text-ink">{formatDate(createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Share card */}
            <div className="bg-white rounded-2xl card-shadow p-7">
              <h3 className="font-display font-semibold text-ink">Share this pool</h3>
              <div className="flex items-center gap-2.5 mt-4">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand text-sm text-ink hover:bg-parchment transition-colors"
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-xl border border-sand text-stone hover:bg-parchment transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pledge Modal */}
      <PledgeModal
        initiative={initiative}
        isOpen={pledgeModalOpen}
        onClose={() => setPledgeModalOpen(false)}
      />
    </PageLayout>
  );
}
