import { useInitiatives } from '@/hooks/useInitiatives';
import { Users, Globe, Zap, ArrowRight, Shield, HandCoins, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InitiativeCard } from '@/components/InitiativeCard';

const Index = () => {
  const { data: initiatives = [], isLoading } = useInitiatives();
  const totalHeld = initiatives.reduce((s, i) => s + i.heldAmount, 0);
  const featured = initiatives.filter((i) => i.status === 'open').slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'hsl(var(--hero-bg))' }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse at 50% 80%, hsl(var(--hero-accent) / 0.15), transparent 70%)'
        }} />

        <div className="container relative z-10 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
            style={{
              borderColor: 'hsl(var(--hero-muted) / 0.3)',
              color: 'hsl(var(--hero-muted))',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Community-powered funding</span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
            style={{ color: 'hsl(var(--hero-foreground))' }}
          >
            Pool your power.
            <br />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'hsl(var(--hero-accent))',
              }}
            >
              Fund what matters.
            </span>
          </h1>

          <p
            className="max-w-xl mx-auto text-base md:text-lg mb-10 leading-relaxed"
            style={{ color: 'hsl(var(--hero-muted))' }}
          >
            When your community pledges together, funds are held — not
            charged — until the goal is met. If it works, everyone pays. If not, nobody does.
          </p>

          <div className="flex items-center justify-center gap-3 mb-16">
            <Link to="/pools">
              <Button
                size="lg"
                className="gap-2 rounded-full text-base px-6"
                style={{
                  background: 'hsl(var(--hero-accent))',
                  color: 'hsl(0 0% 100%)',
                }}
              >
                Explore Pools <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/create">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base px-6"
                style={{
                  borderColor: 'hsl(var(--hero-foreground) / 0.25)',
                  color: 'hsl(var(--hero-foreground))',
                  background: 'transparent',
                }}
              >
                Start a Pool
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-10 md:gap-16">
            {[
              { icon: Users, value: '2,400+', label: 'Community members' },
              { icon: Globe, value: `£${Math.round(totalHeld / 1000)}K`, label: 'Total pledged' },
              { icon: Zap, value: '89%', label: 'Success rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(var(--hero-muted) / 0.5)' }} />
                <p
                  className="text-3xl md:text-4xl font-bold font-display tracking-tight"
                  style={{ color: 'hsl(var(--hero-foreground))' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--hero-muted))' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground mb-3">
            How Tidepool Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A simple, risk-free way to fund community projects together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: HandCoins,
              title: 'Pledge',
              description: 'Commit any amount to a pool. Your money is held securely — never charged upfront.',
            },
            {
              icon: Shield,
              title: 'Hold',
              description: 'Funds stay on hold until the community goal is reached. No risk, full transparency.',
            },
            {
              icon: CheckCircle,
              title: 'Fund or Refund',
              description: 'Hit the goal? Everyone pays and the project happens. Miss it? Everyone gets refunded.',
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-border bg-card p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute top-4 right-5 text-xs font-bold text-muted-foreground/40 font-display">
                0{i + 1}
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Pools */}
      <section className="container pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-foreground mb-1">
              Featured Pools
            </h2>
            <p className="text-muted-foreground text-sm">Active initiatives looking for your support.</p>
          </div>
          <Link to="/pools">
            <Button variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No active pools at the moment.
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
