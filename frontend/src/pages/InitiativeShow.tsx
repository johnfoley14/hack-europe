import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useInitiative } from '@/hooks/useInitiatives';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { CountdownTimer } from '@/components/CountdownTimer';
import { PledgeForm } from '@/components/PledgeForm';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { ArrowLeft, MapPin, User, MessageSquare, Loader2 } from 'lucide-react';

const InitiativeShow = () => {
  const { id } = useParams();
  const { data: initiative, isLoading, error } = useInitiative(id || '');
  const [held, setHeld] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('open');

  // Update local state when initiative data loads
  if (initiative && held === 0 && initiative.heldAmount > 0) {
    setHeld(initiative.heldAmount);
  }
  if (initiative && currentStatus === 'open' && initiative.status !== 'open') {
    setCurrentStatus(initiative.status);
  }

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !initiative) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Initiative not found.</p>
        <Link to="/" className="text-primary text-sm mt-2 inline-block">← Back to Dashboard</Link>
      </div>
    );
  }

  const deadlineDate = new Date(initiative.deadline);
  const hoursLeft = (deadlineDate.getTime() - Date.now()) / 3600000;
  const endingSoon = currentStatus === 'open' && hoursLeft > 0 && hoursLeft < 24;

  const handlePledge = (amount: number, newHeldAmount: number) => {
    setHeld(newHeldAmount);
    if (newHeldAmount >= initiative.goalAmount) {
      setCurrentStatus('funded');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="min-h-screen">
      {showConfetti && <ConfettiEffect />}

      {/* Success/failure banners */}
      {currentStatus === 'funded' && (
        <div className="bg-success text-success-foreground text-center py-3 text-sm font-medium">
          🎉 This initiative has been fully funded!
        </div>
      )}
      {currentStatus === 'failed' && (
        <div className="bg-destructive text-destructive-foreground text-center py-3 text-sm font-medium">
          This initiative did not reach its goal.
        </div>
      )}

      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <StatusBadge status={currentStatus} endingSoon={endingSoon} />
                <CountdownTimer deadline={initiative.deadline} />
              </div>

              <h1 className="text-3xl font-bold font-display mb-2">{initiative.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {initiative.organizer.name}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {initiative.location.address}</span>
              </div>

              {/* Big progress */}
              <div className="rounded-xl bg-card border border-border p-6">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-3xl font-bold font-display">£{held.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">of £{initiative.goalAmount.toLocaleString()} goal</p>
                  </div>
                  <CountdownTimer deadline={initiative.deadline} variant="full" />
                </div>
                <ProgressBar current={held} goal={initiative.goalAmount} status={currentStatus} size="lg" />
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold font-display mb-3">About this Initiative</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{initiative.description}</p>
            </div>

            {/* Updates */}
            {initiative.updates && initiative.updates.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Updates
                </h2>
                <div className="space-y-4">
                  {initiative.updates.map((update, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p className="text-sm">{update.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(update.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pledgers */}
            {initiative.pledgers && initiative.pledgers.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold font-display mb-4">Supporters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {initiative.pledgers.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">£{p.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="text-lg font-semibold font-display mb-3">Location</h2>
              <div className="rounded-xl overflow-hidden border border-border h-64 relative">
                <iframe
                  title="Pool location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'brightness(0.85) contrast(1.1)' }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${initiative.location.lng - 0.015}%2C${initiative.location.lat - 0.01}%2C${initiative.location.lng + 0.015}%2C${initiative.location.lat + 0.01}&layer=mapnik&marker=${initiative.location.lat}%2C${initiative.location.lng}`}
                />
                <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-foreground font-medium flex items-center gap-1.5 border border-border">
                  <MapPin className="w-3 h-3 text-primary" /> {initiative.location.address}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PledgeForm
                initiativeId={initiative.id}
                goalAmount={initiative.goalAmount}
                heldAmount={held}
                status={currentStatus}
                onPledge={handlePledge}
              />
            </div>

            {/* Mobile sticky CTA */}
            {currentStatus === 'open' && (
              <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4 z-30">
                <a href="#pledge-mobile" className="block">
                  <button className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm animate-pulse-glow">
                    Make a Pledge
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeShow;
