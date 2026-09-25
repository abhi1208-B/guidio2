import React, { useState, useMemo } from 'react';
import { Search, Users, ShieldCheck, MapPin, Globe, PlusCircle, ArrowUpDown } from 'lucide-react';
import { Guide, Destination } from '../types';
import { GuideCard } from './GuideCard';

interface GuidesViewProps {
  guides: Guide[];
  destinations: Destination[];
  onBookGuide: (guide: Guide) => void;
  onContactGuide: (guide: Guide) => void;
  onViewGuideProfile: (guide: Guide) => void;
  onOpenJoinGuide: () => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({
  guides,
  destinations,
  onBookGuide,
  onContactGuide,
  onViewGuideProfile,
  onOpenJoinGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price-low'>('rating');

  // Extract districts from guides
  const districts = useMemo(() => {
    const set = new Set(guides.map((g) => g.district));
    return ['All', ...Array.from(set).sort()];
  }, [guides]);

  // Extract languages from guides
  const languages = useMemo(() => {
    const set = new Set(guides.flatMap((g) => g.languages));
    return ['All', ...Array.from(set).sort()];
  }, [guides]);

  // Filtered & Sorted Guides
  const filteredGuides = useMemo(() => {
    return guides
      .filter((guide) => {
        const matchesDist =
          selectedDistrict === 'All' || guide.district === selectedDistrict;

        const matchesLang =
          selectedLanguage === 'All' || guide.languages.includes(selectedLanguage);

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          guide.name.toLowerCase().includes(q) ||
          guide.district.toLowerCase().includes(q) ||
          guide.badgeTitle.toLowerCase().includes(q) ||
          guide.specialties.some((s) => s.toLowerCase().includes(q)) ||
          guide.bio.toLowerCase().includes(q);

        return matchesDist && matchesLang && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
        if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
        return b.rating - a.rating;
      });
  }, [guides, selectedDistrict, selectedLanguage, searchQuery, sortBy]);

  return (
    <div className="py-12 bg-[#FBFBF9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
              Verified Local Experts
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Karnataka Local Guide Directory ({guides.length})
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              ASI licensed archaeologists, wildlife naturalists, and local cultural storytellers.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenJoinGuide}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#E8B960]" />
            <span>Join as a Guide</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guide name, specialty, or expertise..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* District */}
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

            {/* Language */}
            <div className="sm:col-span-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              >
                <option value="All">All Languages</option>
                {languages
                  .filter((l) => l !== 'All')
                  .map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              >
                <option value="rating">Top Rated</option>
                <option value="experience">Most Experience</option>
                <option value="price-low">Lowest Hourly Rate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200">
            <h3 className="font-serif text-xl font-bold text-neutral-800">
              No guides match your criteria
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try selecting "All Districts" or clearing the search text to view available Karnataka guides.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onBook={onBookGuide}
                onContact={onContactGuide}
                onViewProfile={onViewGuideProfile}
                destinations={destinations}
              />
            ))}
          </div>
        )}

        {/* Guide Recruitment Callout */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#144533] to-[#1E5C45] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold">
              Are you a local Karnataka resident or guide?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-200 max-w-xl">
              Create your free guide profile in under 3 minutes. Keep 100% of your tour fees with direct tourist inquiries and booking notifications.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenJoinGuide}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-[#0D2E22] bg-[#E8B960] hover:bg-[#DDA94C] rounded-xl shadow-md transition-colors cursor-pointer shrink-0"
          >
            Create Guide Profile Now
          </button>
        </div>
      </div>
    </div>
  );
};
