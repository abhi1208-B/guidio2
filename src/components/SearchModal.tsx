import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Users, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Destination, Guide } from '../types';

interface SearchModalProps {
  destinations: Destination[];
  guides: Guide[];
  onClose: () => void;
  onSelectDestination: (dest: Destination) => void;
  onSelectGuide: (guide: Guide) => void;
  initialQuery?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  destinations,
  guides,
  onClose,
  onSelectDestination,
  onSelectGuide,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'all' | 'destinations' | 'guides'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchedDestinations = destinations.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.district.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)) ||
      d.shortDescription.toLowerCase().includes(q),
  );

  const matchedGuides = guides.filter(
    (g) =>
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.district.toLowerCase().includes(q) ||
      g.languages.some((l) => l.toLowerCase().includes(q)) ||
      g.specialties.some((s) => s.toLowerCase().includes(q)) ||
      g.badgeTitle.toLowerCase().includes(q),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-4 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-neutral-200 bg-white">
          <Search className="w-5 h-5 text-[#1B4332] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Karnataka places, heritage sites, wildlife, districts, or local guides..."
            className="w-full text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-md cursor-pointer shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Filter Type Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-50 border-b border-neutral-200 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
              filterType === 'all'
                ? 'bg-[#1B4332] text-white'
                : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Results ({matchedDestinations.length + matchedGuides.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('destinations')}
            className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
              filterType === 'destinations'
                ? 'bg-[#1B4332] text-white'
                : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Destinations ({matchedDestinations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('guides')}
            className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
              filterType === 'guides'
                ? 'bg-[#1B4332] text-white'
                : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Guides ({matchedGuides.length})
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Matched Destinations */}
          {(filterType === 'all' || filterType === 'destinations') && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1B4332]" />
                  Destinations ({matchedDestinations.length})
                </span>
              </div>

              {matchedDestinations.length === 0 ? (
                <div className="text-xs text-neutral-400 italic py-2">
                  No matching destinations found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {matchedDestinations.slice(0, 8).map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectDestination(dest);
                      }}
                      className="text-left p-3 rounded-xl border border-neutral-200 hover:border-[#1B4332] hover:bg-neutral-50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-sm text-neutral-900 group-hover:text-[#1B4332] truncate">
                          {dest.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 truncate">
                          {dest.district} · {dest.category}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B4332] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Matched Guides */}
          {(filterType === 'all' || filterType === 'guides') && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#1B4332]" />
                  Local Guides ({matchedGuides.length})
                </span>
              </div>

              {matchedGuides.length === 0 ? (
                <div className="text-xs text-neutral-400 italic py-2">
                  No matching guides found for this query.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {matchedGuides.slice(0, 6).map((guide) => (
                    <button
                      key={guide.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectGuide(guide);
                      }}
                      className="text-left p-3 rounded-xl border border-neutral-200 hover:border-[#1B4332] hover:bg-neutral-50 transition-all flex items-center gap-3 group cursor-pointer"
                    >
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-neutral-900 group-hover:text-[#1B4332] truncate flex items-center gap-1">
                          <span>{guide.name}</span>
                          {guide.verified && (
                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">
                          {guide.district} · {guide.badgeTitle}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-800 shrink-0">
                        ₹{guide.hourlyRate}/h
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
