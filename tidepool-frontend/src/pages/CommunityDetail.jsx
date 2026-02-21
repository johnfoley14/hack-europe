import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Lock, Globe, Copy, Check } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import InitiativeCard from '../components/shared/InitiativeCard';
import Avatar from '../components/shared/Avatar';
import EmptyState from '../components/shared/EmptyState';
import { communities } from '../data/communities';
import { initiatives } from '../data/initiatives';
import { users } from '../data/users';

export default function CommunityDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('open');
  const [copied, setCopied] = useState(false);

  const community = communities.find((c) => c.id === id);

  if (!community) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <h1 className="font-display text-2xl font-bold text-ink">
            Community not found
          </h1>
          <p className="text-stone mt-3">
            The community you are looking for does not exist.
          </p>
          <Link
            to="/explore"
            className="mt-6 rounded-xl bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-light"
          >
            Browse communities
          </Link>
        </div>
      </PageLayout>
    );
  }

  const communityInitiatives = initiatives.filter(
    (i) => i.community.id === community.id
  );

  const tabStatusMap = { open: 'open', funded: 'funded', failed: 'failed' };
  const filteredInitiatives = communityInitiatives.filter(
    (i) => i.status === tabStatusMap[activeTab]
  );

  const memberUsers = community.members
    .map((memberId) => users.find((u) => u.id === memberId))
    .filter(Boolean);

  const handleCopy = () => {
    navigator.clipboard.writeText(community.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { key: 'open', label: 'Active Pools', count: communityInitiatives.filter((i) => i.status === 'open').length },
    { key: 'funded', label: 'Completed', count: communityInitiatives.filter((i) => i.status === 'funded').length },
    { key: 'failed', label: 'Failed', count: communityInitiatives.filter((i) => i.status === 'failed').length },
  ];

  return (
    <PageLayout>
      {/* Community Header */}
      <div className="bg-white rounded-2xl card-shadow p-8 lg:p-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink">
            {community.name}
          </h1>
          <span className="inline-flex items-center gap-2 text-xs font-medium bg-parchment rounded-full px-4 py-2 text-stone">
            {community.visibility === 'invite-only' ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Globe className="h-3.5 w-3.5" />
            )}
            {community.visibility === 'invite-only' ? 'Invite only' : 'Public'}
          </span>
        </div>

        <p className="text-stone mt-3 leading-relaxed text-[15px] max-w-2xl">
          {community.description}
        </p>

        <div className="mt-5 flex gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-stone">
            <Users className="h-4 w-4" />
            <span className="font-medium text-ink">{community.memberCount}</span> members
          </div>
          <div className="text-sm text-stone">
            <span className="font-medium text-ink">{community.activePoolCount}</span> active pools
          </div>
          <div className="text-sm text-stone">
            <span className="font-medium text-ink">{community.completedPoolCount}</span> completed
          </div>
        </div>

        {community.visibility === 'invite-only' && (
          <div className="mt-6 bg-parchment rounded-xl p-5 flex items-center justify-between">
            <span className="text-sm text-ink">
              Invite Code:{' '}
              <span className="font-mono font-semibold bg-white px-3 py-1 rounded-lg border border-sand ml-2">
                {community.inviteCode}
              </span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-dark transition-colors px-4 py-2 rounded-lg hover:bg-white"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-10 flex gap-2 bg-parchment-dark rounded-xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm rounded-lg cursor-pointer transition-all ${
              activeTab === tab.key
                ? 'bg-white text-forest card-shadow'
                : 'text-stone hover:text-ink'
            }`}
          >
            {tab.label}
            <span className={`text-xs rounded-full px-2 py-0.5 ${
              activeTab === tab.key
                ? 'bg-forest/10 text-forest'
                : 'bg-sand text-stone'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Initiative grid */}
      <div className="mt-8">
        {filteredInitiatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInitiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase() || 'pools'}`}
            description={
              activeTab === 'open'
                ? 'There are no active pools in this community right now.'
                : activeTab === 'funded'
                  ? 'No pools have been completed yet.'
                  : 'No pools have failed in this community.'
            }
          />
        )}
      </div>

      {/* Members section */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          Members ({community.memberCount})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {memberUsers.map((member) => {
            const isOrganizer = community.organizers.includes(member.id);

            return (
              <div
                key={member.id}
                className="bg-white rounded-xl card-shadow px-5 py-4 flex items-center gap-3"
              >
                <Avatar name={member.name} size="sm" />
                <span className="text-sm text-ink font-medium flex-1">{member.name}</span>
                {isOrganizer && (
                  <span className="text-[10px] font-semibold bg-amber/15 text-amber-dark rounded-full px-2 py-0.5">
                    Organizer
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
}
