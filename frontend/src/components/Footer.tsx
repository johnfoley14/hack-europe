import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="20" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
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
              <span className="font-display font-bold text-lg text-foreground">Tidepool</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pool your power. Fund what matters. Community-driven pledging for the things that count.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/pools', label: 'Browse Pools' },
                { to: '/map', label: 'Explore Map' },
                { to: '/create', label: 'Start a Pool' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['How It Works', 'FAQ', 'Community Guidelines', 'Support'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tidepool. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary" /> for communities everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
