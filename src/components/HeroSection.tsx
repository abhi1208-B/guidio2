import React, { useState } from 'react';
import { Search, Compass, Users, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { ALL_DESTINATIONS } from '../data/destinations';
import { Destination } from '../types';

interface HeroSectionProps {
  onExploreClick: () => void;
  onJoinGuideClick: () => void;
  onSelectDestination: (dest: Destination) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onJoinGuideClick,
  onSelectDestination,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const matches = ALL_DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.district.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setIsFocused(false);
    } else {
      onExploreClick();
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0D2E22] text-white">
      {/* Background Graphic Scrim and Landscape Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage:
            'url("https://upload.wikimedia.org/wikipedia/commons/b/bb/Stone_Chariot_at_Hampi%2C_Karnataka.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B241B]/80 via-[#0E3327]/90 to-[#0B241B]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        {/* Subtle Region Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-200 backdrop-blur-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B960]" />
          <span>One State · Many Worlds · 42+ Curated Destinations</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto text-balance">
          Discover Karnataka Through Local Eyes
        </h1>

        {/* Subheadline */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
          Explore unforgettable places, meet local guides, and experience Karnataka beyond the usual tourist trail.
        </p>

        {/* Prominent Search Box */}
        <div className="mt-10 max-w-2xl mx-auto relative z-20">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 sm:p-2.5 border border-white/20"
          >
            <div className="pl-3 pr-2 text-neutral-400">
              <Search className="w-5 h-5 text-[#1B4332]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 250)}
              placeholder="Where do you want to go? (e.g. Hampi, Coorg, Waterfalls, Gokarna)"
              className="w-full text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-hidden pr-3"
            />
            <button
              type="submit"
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4 text-[#E8B960]" />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden text-left z-30">
              <div className="px-4 py-2 bg-neutral-50 text-[11px] font-mono text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                Matching Destinations & Experiences
              </div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectDestination(item);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center justify-between border-b border-neutral-100 last:border-b-0 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{item.name}</div>
                    <div className="text-xs text-neutral-500">
                      {item.district} · {item.category}
                    </div>
                  </div>
                  <div className="text-xs text-[#1B4332] font-medium flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick search suggestions */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-neutral-300">
            <span className="text-white/60">Popular:</span>
            {['Hampi', 'Coorg', 'Mysore Palace', 'Gokarna', 'Jog Falls', 'Dandeli'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  onSearchSubmit(term);
                }}
                className="hover:text-[#E8B960] hover:underline cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#0D2E22] bg-[#E8B960] hover:bg-[#DDA94C] rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Karnataka</span>
          </button>
          <button
            type="button"
            onClick={onJoinGuideClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors cursor-pointer whitespace-nowrap backdrop-blur-xs"
          >
            <Users className="w-4 h-4 text-[#E8B960]" />
            <span>Become a Guide</span>
          </button>
        </div>

        {/* Adjacency Proof Numbers (anti-slop tabular metrics) */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-serif text-2xl md:text-3xl font-bold text-white tabular-nums">42+</div>
            <div className="text-xs text-neutral-300 mt-0.5">Destinations Verified</div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-bold text-white tabular-nums">12+</div>
            <div className="text-xs text-neutral-300 mt-0.5">Local Districts Covered</div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-bold text-white tabular-nums">100%</div>
            <div className="text-xs text-neutral-300 mt-0.5">Verified Local Guides</div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-bold text-white tabular-nums">Zero</div>
            <div className="text-xs text-neutral-300 mt-0.5">Agency Commission Markup</div>
          </div>
        </div>
      </div>
    </section>
  );
};
