import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/live-evaluation', label: 'Live Evaluation' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 10, 15, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Car className="text-[#00ff88]" size={28} />
            <span className="font-bold text-lg neon-text tracking-wider">
              Vehixa AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                style={{
                  color: isActive(link.path) ? '#00ff88' : '#94a3b8',
                  background: isActive(link.path) ? 'rgba(0,255,136,0.08)' : 'transparent',
                  textShadow: isActive(link.path) ? '0 0 10px rgba(0,255,136,0.5)' : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#00ff88';
                  (e.target as HTMLElement).style.textShadow = '0 0 10px rgba(0,255,136,0.5)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    (e.target as HTMLElement).style.color = '#94a3b8';
                    (e.target as HTMLElement).style.textShadow = 'none';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm text-gray-400">
                  Hello, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/live-evaluation"
                className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-800 rounded-lg transition-colors"
                style={{
                  color: isActive(link.path) ? '#00ff88' : '#94a3b8',
                }}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="mt-4 px-4 space-y-2">
                <p className="text-sm text-gray-400">Hello, {user?.name}</p>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/live-evaluation"
                onClick={() => setOpen(false)}
                className="block mx-4 mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg text-center transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}