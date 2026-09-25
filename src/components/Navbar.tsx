import React, { useState } from 'react';
import { Search, Menu, X, Compass, User, PlusCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenJoinGuide: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  activeGuideCount: number;
  currentUser?: { name: string; isGuide?: boolean } | null;
  onOpenGuideDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenJoinGuide,
  onOpenAuth,
  activeGuideCount,
  currentUser,
  onOpenGuideDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'guides', label: 'Guides' },
    { id: 'community', label: 'Community' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-baseline gap-1.5 cursor-pointer text-left focus-visible:outline-hidden"
          >
            <span className="font-serif text-2xl font-black tracking-tight text-[#1B4332]">
              Guido
            </span>
            <span className="text-[11px] font-mono uppercase font-semibold text-[#C98A2C] tracking-widest">
              Karnataka
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeTab === link.id
                  ? 'text-[#1B4332] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1B4332]'
                  : 'hover:text-neutral-950'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenJoinGuide}
            className="text-[#1B4332] hover:text-[#0C2B20] font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C98A2C]" />
            <span>Join as Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions & Search */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title="Search destinations & guides"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenGuideDashboard}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Guide Portal</span>
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate max-w-[100px]">{currentUser.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#1B4332] text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinGuide();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#C98A2C]" />
              <span>Join Guido as Local Guide</span>
            </button>

            {!currentUser && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-[#1B4332] rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
