import React from 'react';
import { ArrowRight, Users, MapPin, Sparkles } from 'lucide-react';
import { Destination } from '../types';
import { AttributedImage } from './AttributedImage';

interface DestinationCardProps {
  destination: Destination;
  onExplore: (destination: Destination) => void;
  onFindGuide: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onExplore,
  onFindGuide,
}) => {
  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#1B4332]/30 transition-all duration-200">
      {/* Photo with Wikimedia Commons attribution */}
      <div
        className="relative cursor-pointer overflow-hidden aspect-[16/10]"
        onClick={() => onExplore(destination)}
      >
        <AttributedImage
          image={destination.image}
          alt={`${destination.name}, ${destination.district}, Karnataka`}
          aspectRatio="auto"
          className="w-full h-full"
          attributionPlacement="bottom-overlay"
          fallbackTitle={destination.name}
          fallbackCategory={destination.category}
        />
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
          <MapPin className="w-3 h-3 text-[#E8B960]" />
          <span>{destination.district}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              onClick={() => onExplore(destination)}
              className="text-xl font-serif font-bold text-neutral-900 group-hover:text-[#1B4332] transition-colors cursor-pointer"
            >
              {destination.name}
            </h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              {destination.category} · {destination.district}
              {destination.kannadaName && (
                <span className="text-neutral-400 font-normal ml-1.5">
                  ({destination.kannadaName})
                </span>
              )}
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed flex-1">
          {destination.shortDescription}
        </p>

        {/* Tags (Zero-Pill Discipline: unboxed text with separators per guidelines) */}
        <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center flex-wrap gap-x-1.5 text-xs text-neutral-500">
          <span className="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">Tags:</span>
          {destination.tags.slice(0, 3).map((tag, idx) => (
            <React.Fragment key={tag}>
              <span className="text-neutral-700 hover:text-[#1B4332] font-medium">{tag}</span>
              {idx < Math.min(destination.tags.length, 3) - 1 && (
                <span className="text-neutral-300 select-none">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onExplore(destination)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFindGuide(destination)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 text-[#E8B960]" />
            <span>Find a Guide</span>
          </button>
        </div>
      </div>
    </article>
  );
};
