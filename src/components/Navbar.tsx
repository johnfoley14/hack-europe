import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Globe, LayoutDashboard, Droplets, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/pools', label: 'Pools', icon: Droplets },
  { to: '/map', label: 'Map', icon: Globe },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <svg width="32" height="24" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <ellipse cx="100" cy="40" rx="80" ry="25" />
                <ellipse cx="100" cy="40" rx="60" ry="15" />
                <path d="M 20,40 C 20,75 180,75 180,40 M 20,65 C 20,95 180,95 180,65" />
                <path d="M 20,90 C 20,130 180,130 180,90" />
                <path d="M 20,40 L 20,95" />
                <path d="M 180,40 L 180,95" />
                <path d="M 45,70 Q 70,75 90,72" strokeWidth="4" />
                <path d="M 45,105 Q 70,110 90,107" strokeWidth="4" />
              </g>
            </svg>
            <span className="font-display font-bold text-lg hidden sm:block text-foreground">Tidepool</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.to
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/create">
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Initiative</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
