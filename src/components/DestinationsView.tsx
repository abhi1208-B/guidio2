import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Destination } from '../types';
import { CATEGORIES } from '../data/categories';
import { DestinationCard } from './DestinationCard';

interface DestinationsViewProps {
  destinations: Destination[];
  initialCategory?: string;
  initialDistrict?: string;
  initialSearch?: string;
  onExploreDestination: (dest: Destination) => void;
  onFindGuideForDestination: (dest: Destination) => void;
}

export const DestinationsView: React.FC<DestinationsViewProps> = ({
  destinations,
  initialCategory = 'All',
  initialDistrict = 'All',
  initialSearch = '',
  onExploreDestination,
  onFindGuideForDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [sortBy, setSortBy] = useState<'recommended' | 'name-asc' | 'district'>('recommended');

  // Extract unique districts
  const districts = useMemo(() => {
    const set = new Set(destinations.map((d) => d.district));
    return ['All', ...Array.from(set).sort()];
  }, [destinations]);

  // Filter & Sort
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const matchesCat =
          selectedCategory === 'All' ||
          dest.category === selectedCategory ||
          (dest.additionalCategories && dest.additionalCategories.includes(selectedCategory as any));

        const matchesDist =
          selectedDistrict === 'All' || dest.district === selectedDistrict;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          dest.name.toLowerCase().includes(q) ||
          dest.district.toLowerCase().includes(q) ||
          dest.category.toLowerCase().includes(q) ||
          dest.tags.some((t) => t.toLowerCase().includes(q)) ||
          dest.shortDescription.toLowerCase().includes(q);

        return matchesCat && matchesDist && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'district') return a.district.localeCompare(b.district);
        // Default recommended: featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [destinations, selectedCategory, selectedDistrict, searchQuery, sortBy]);

  return (
    <div className="py-12 bg-[#FBFBF9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
              Destinations Database
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Explore Karnataka ({destinations.length} Places)
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              From Vijayanagara stone monuments to pristine Western Ghats rainforests.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredDestinations.length}</strong> matching places
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, district, keyword (e.g. Hampi, Coorg, Waterfalls)..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* District dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              >
                <option value="All">All Districts ({districts.length - 1})</option>
                {districts
                  .filter((d) => d !== 'All')
                  .map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort dropdown */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              >
                <option value="recommended">Sort: Featured First</option>
                <option value="name-asc">Sort: Name (A - Z)</option>
                <option value="district">Sort: District</option>
              </select>
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Categories ({destinations.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200">
            <h3 className="font-serif text-xl font-bold text-neutral-800">
              No destinations match your filters
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try resetting your search query, choosing "All Districts" or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDistrict('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#1B4332] bg-emerald-50 rounded-lg hover:bg-emerald-100 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onExplore={onExploreDestination}
                onFindGuide={onFindGuideForDestination}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
