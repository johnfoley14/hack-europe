import { Link } from 'react-router-dom';

const productLinks = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Explore', to: '/explore' },
  { label: 'Communities', to: '/communities/com_1' },
  { label: 'Start a Pool', to: '/initiatives/new' },
];

const aboutLinks = [
  { label: 'Our mission', to: '/#mission' },
  { label: 'Security', to: '/#security' },
  { label: 'Privacy', to: '/#privacy' },
  { label: 'Terms', to: '/#terms' },
];

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white/70">
      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 lg:px-12">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber" />
              <span className="font-display font-bold text-white text-xl tracking-tight">
                tidepool
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Pool your power. Fund what matters. Community crowdfunding with
              zero-risk pledges.
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: About */}
          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-5">
              About
            </h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">&copy; 2026 Tidepool</p>
          <p className="text-sm text-white/30">Built for communities</p>
        </div>
      </div>
    </footer>
  );
}
