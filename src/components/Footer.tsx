import React from 'react';
import { Compass, Heart, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenJoinGuide: () => void;
  onFilterDistrict: (district: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onOpenJoinGuide,
  onFilterDistrict,
}) => {
  const topDistricts = [
    'Mysuru',
    'Vijayanagara',
    'Kodagu',
    'Chikkamagaluru',
    'Uttara Kannada',
    'Udupi',
    'Bagalkote',
    'Shivamogga',
  ];

  return (
    <footer className="bg-[#0B241B] text-white border-t border-emerald-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-black tracking-tight text-white">
                Guido
              </span>
              <span className="text-xs font-mono uppercase font-semibold text-[#E8B960] tracking-widest">
                Karnataka
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-sm">
              The premier platform connecting travelers with certified, passionate local guides across Karnataka. Discover authentic heritage, pristine rainforests, ancient temples, and coastal treasures through local eyes.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-[#E8B960]" />
              <span>Verified local guides · 100% direct payouts</span>
            </div>
          </div>

          {/* Col 2: Explore Karnataka */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#E8B960] font-semibold mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All 42+ Destinations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  UNESCO World Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Waterfalls & Western Ghats
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('community')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Community Photo Stories
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Local Guides */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#E8B960] font-semibold mb-3">
              Local Guides
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('guides')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse Guide Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenJoinGuide}
                  className="hover:text-white text-[#E8B960] font-semibold transition-colors cursor-pointer"
                >
                  Join as a Local Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Guide Verification Standards
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How Guido Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Districts */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#E8B960] font-semibold mb-3">
              Popular Districts
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {topDistricts.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => onFilterDistrict(dist)}
                  className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer"
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wikimedia Photo Attribution Notice (Section 7 compliance) */}
        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-neutral-400 space-y-2 leading-relaxed">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>
              Destination photography provided by generous contributors via{' '}
              <a
                href="https://commons.wikimedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white text-[#E8B960]"
              >
                Wikimedia Commons
              </a>{' '}
              under Creative Commons (CC BY-SA 3.0 / 4.0 / CC0) licenses. Individual author attributions are embedded with each photograph.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span>Made with pride for Karnataka Tourism · One State Many Worlds</span>
          </div>
          <div>
            © {new Date().getFullYear()} Guido Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
