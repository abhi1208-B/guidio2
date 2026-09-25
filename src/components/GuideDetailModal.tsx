import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Globe,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  MessageCircle,
} from 'lucide-react';
import { Guide, Destination } from '../types';
import { generateDefaultGuideAvatar } from '../utils/photoStorage';

interface GuideDetailModalProps {
  guide: Guide;
  destinations: Destination[];
  onClose: () => void;
  onBook: (guide: Guide) => void;
  onContact: (guide: Guide) => void;
  onSelectDestination: (dest: Destination) => void;
  onEditGuide?: (guide: Guide) => void;
  isCurrentUserGuide?: boolean;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({
  guide,
  destinations,
  onClose,
  onBook,
  onContact,
  onSelectDestination,
  onEditGuide,
  isCurrentUserGuide,
}) => {
  // Matched destination objects
  const coveredDestObjects = guide.coveredDestinations
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is Destination => Boolean(d));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FBFBF9]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
              Certified Guide Profile
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs text-neutral-500 font-medium">{guide.district}</span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentUserGuide && onEditGuide && (
              <button
                type="button"
                onClick={() => onEditGuide(guide)}
                className="px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Edit My Profile
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Guide Profile Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-[#F8F7F2] rounded-2xl border border-neutral-200/80">
            <div className="relative">
              <img
                src={guide.photo || generateDefaultGuideAvatar(guide.name)}
                alt={guide.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = generateDefaultGuideAvatar(guide.name);
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              {guide.verified && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                  {guide.name}
                </h2>
                <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{guide.rating.toFixed(2)}</span>
                  <span className="text-neutral-500 font-normal">({guide.reviewCount} tours)</span>
                </div>
              </div>

              <div className="text-sm font-semibold text-[#1B4332] mt-0.5">
                {guide.badgeTitle}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {guide.district}, Karnataka
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-neutral-400" />
                  {guide.yearsExperience} Years Experience
                </span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">{guide.availability}</span>
              </div>
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
              About {guide.name}
            </h3>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {guide.bio}
            </p>
          </div>

          {/* Languages & Specialties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                <Globe className="w-4 h-4 text-[#1B4332]" />
                <span>Languages Spoken</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {guide.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 bg-white border border-neutral-200 rounded-md text-xs font-medium text-neutral-800"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                <span>Specialization Areas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {guide.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 bg-white border border-neutral-200 rounded-md text-xs font-medium text-[#1B4332]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Destinations Covered by this Guide */}
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-3">
              Destinations & Circuits Covered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coveredDestObjects.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => {
                    onClose();
                    onSelectDestination(dest);
                  }}
                  className="flex items-center justify-between p-3 bg-white hover:bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C98A2C] shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-neutral-900">{dest.name}</div>
                      <div className="text-xs text-neutral-500">{dest.district} · {dest.category}</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#1B4332] font-semibold">View</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Honorarium & Rates */}
          <div className="p-5 bg-[#F6F4ED] rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Guide Honorarium Rates
              </div>
              <div className="mt-1 flex items-baseline gap-4">
                <div>
                  <span className="text-2xl font-serif font-bold text-neutral-900">
                    ₹{guide.hourlyRate}
                  </span>
                  <span className="text-xs text-neutral-600"> / hour</span>
                </div>
                <div className="text-neutral-300">|</div>
                <div>
                  <span className="text-2xl font-serif font-bold text-neutral-900">
                    ₹{guide.dailyRate}
                  </span>
                  <span className="text-xs text-neutral-600"> / full day (8 hrs)</span>
                </div>
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Zero booking fees or agent cuts. Paid directly to {guide.name}.
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onContact(guide)}
                className="px-4 py-2.5 text-xs font-bold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call / Contact</span>
              </button>
              <button
                type="button"
                onClick={() => onBook(guide)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E8B960]" />
                <span>Book This Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
