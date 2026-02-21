import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function NavAvatar({ name }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center text-xs font-semibold"
      title={name}
    >
      {initials}
    </div>
  );
}

const navLinks = [
  { to: '/explore', label: 'Explore' },
  { to: '/communities/com_1', label: 'Communities' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-2.5 h-2.5 rounded-full bg-amber transition-transform group-hover:scale-110" />
          <span className="font-display font-bold text-forest text-xl tracking-tight">
            tidepool
          </span>
        </Link>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-forest'
                    : 'text-stone hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right: CTA + Avatar (desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/initiatives/new"
            className="bg-forest text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors duration-150"
          >
            Start a Pool
          </Link>
          <NavAvatar name="Alex Morgan" />
        </div>

        {/* Mobile: Hamburger */}
        <button
          className="md:hidden text-stone hover:text-ink transition p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-sand bg-white/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm py-3 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-forest font-medium bg-parchment'
                      : 'text-stone hover:text-ink hover:bg-parchment/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/initiatives/new"
              onClick={() => setMobileOpen(false)}
              className="bg-forest text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-forest-light transition text-center mt-3"
            >
              Start a Pool
            </Link>
            <div className="flex items-center gap-3 pt-4 mt-2 border-t border-sand">
              <NavAvatar name="Alex Morgan" />
              <span className="text-sm text-ink font-medium">Alex Morgan</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
