import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Globe, Phone, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { Guide, Destination } from '../types';
import { generateDefaultGuideAvatar } from '../utils/photoStorage';

interface GuideCardProps {
  guide: Guide;
  onBook: (guide: Guide) => void;
  onContact: (guide: Guide) => void;
  onViewProfile: (guide: Guide) => void;
  destinations: Destination[];
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  onBook,
  onContact,
  onViewProfile,
  destinations,
}) => {
  const [imgSrc, setImgSrc] = useState(guide.photo || generateDefaultGuideAvatar(guide.name));

  // Get names of covered places
  const coveredPlaces = guide.coveredDestinations
    .map((id) => destinations.find((d) => d.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 hover:border-[#1B4332]/40 transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md group">
      <div>
        {/* Header with Avatar, Rating, and Verification */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={imgSrc}
              alt={guide.name}
              onError={() => setImgSrc(generateDefaultGuideAvatar(guide.name))}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100 shadow-xs"
            />
            {guide.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs"
                title="Verified Karnataka Guide"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3
                onClick={() => onViewProfile(guide)}
                className="font-serif font-bold text-lg text-neutral-900 truncate hover:text-[#1B4332] transition-colors cursor-pointer"
              >
                {guide.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-800 shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{guide.rating.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">({guide.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs text-[#1B4332] font-semibold mt-0.5 truncate">
              {guide.badgeTitle}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{guide.district} & Surrounds</span>
              <span>·</span>
              <span className="shrink-0">{guide.yearsExperience} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3.5 text-xs text-neutral-600 line-clamp-3 leading-relaxed">
          {guide.bio}
        </p>

        {/* Languages & Specialties */}
        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-medium text-neutral-700">Languages:</span>
            <span className="truncate">{guide.languages.join(', ')}</span>
          </div>

          {coveredPlaces.length > 0 && (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-medium text-neutral-700">Covers:</span>
              <span className="truncate">{coveredPlaces.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Pricing & Availability */}
        <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Starting at </span>
            <span className="text-base font-bold text-neutral-900 tabular-nums">
              ₹{guide.hourlyRate}
            </span>
            <span className="text-xs text-neutral-500">/hr</span>
            <span className="text-[11px] text-neutral-400 ml-1">· ₹{guide.dailyRate}/day</span>
          </div>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${
              guide.availability === 'Available Today'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {guide.availability}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onContact(guide)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>
        <button
          type="button"
          onClick={() => onBook(guide)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Calendar className="w-3.5 h-3.5 text-[#E8B960]" />
          <span>Request Guide</span>
        </button>
      </div>
    </div>
  );
};
