import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Train,
  CheckCircle2,
  Compass,
  AlertCircle,
  Users,
  ExternalLink,
  ChevronRight,
  Share2,
  Camera,
  Phone,
  MessageSquare,
  ZoomIn,
  ChevronLeft,
} from 'lucide-react';
import { Destination, Guide, WikimediaImage } from '../types';
import { AttributedImage } from './AttributedImage';
import { GoogleMapsPlaceIntel } from './GoogleMapsPlaceIntel';

interface DestinationDetailModalProps {
  destination: Destination;
  guides: Guide[];
  onClose: () => void;
  onBookGuide: (guide: Guide, destination: Destination) => void;
  onContactGuide: (guide: Guide) => void;
  onUploadPhoto: (destination: Destination) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  guides,
  onClose,
  onBookGuide,
  onContactGuide,
  onUploadPhoto,
}) => {
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gallery images array
  const galleryImages: WikimediaImage[] = React.useMemo(() => {
    if (destination.gallery && destination.gallery.length > 0) {
      return destination.gallery;
    }
    if (destination.images && destination.images.length > 0) {
      return destination.images;
    }
    return [destination.image];
  }, [destination]);

  const currentHeroImage = galleryImages[selectedGalleryIdx] || destination.image;

  // Filter guides who cover this destination
  const matchedGuides = guides.filter(
    (g) =>
      g.coveredDestinations.includes(destination.id) ||
      g.district.toLowerCase() === destination.district.toLowerCase(),
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIdx(index);
    setIsLightboxOpen(true);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev + 1) % galleryImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, galleryImages.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-neutral-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
              Karnataka Guide
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs text-neutral-500 font-medium">
              {destination.district}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Share destination"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {copiedLink ? 'Copied!' : 'Share'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Main Hero Gallery & Thumbnails Container */}
          <div className="space-y-3">
            {/* LARGE DESTINATION PHOTO */}
            <div
              className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm aspect-[16/9] max-h-[460px] relative group cursor-pointer bg-neutral-100"
              onClick={() => openLightbox(selectedGalleryIdx)}
            >
              <AttributedImage
                image={currentHeroImage}
                alt={destination.name}
                aspectRatio="auto"
                className="w-full h-full"
                attributionPlacement="bottom-overlay"
                fallbackTitle={destination.name}
                fallbackCategory={destination.category}
                priority={true}
                showZoomIcon={true}
              />
            </div>

            {/* Thumbnail Row: [Photo 1] [Photo 2] [Photo 3] [Photo 4] */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer bg-neutral-100 ${
                      selectedGalleryIdx === idx
                        ? 'border-[#1B4332] shadow-sm ring-2 ring-[#1B4332]/20'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url || img.image_url}
                      alt={`${destination.name} thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-mono px-1 rounded">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Dedicated Wikimedia Commons Attribution strip below gallery */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-600 font-mono">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-neutral-900">Photo:</span>
                <span>{currentHeroImage.author || 'Wikimedia Contributor'}</span>
                <span>·</span>
                <span className="text-[#1B4332] font-semibold">Wikimedia Commons</span>
                <span>·</span>
                <span className="text-neutral-500">{currentHeroImage.license || 'CC BY-SA 4.0'}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => openLightbox(selectedGalleryIdx)}
                  className="inline-flex items-center gap-1 text-[#1B4332] hover:underline font-semibold cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge Lightbox</span>
                </button>
                {(currentHeroImage.sourceUrl || currentHeroImage.source_url) && (
                  <a
                    href={currentHeroImage.sourceUrl || currentHeroImage.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#C98A2C] hover:underline font-semibold"
                  >
                    <span>View Wikimedia File</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Title and Key Meta */}
          <div className="border-b border-neutral-200 pb-6">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                {destination.name}
              </h1>
              {destination.kannadaName && (
                <span className="text-xl text-neutral-500 font-medium">
                  ({destination.kannadaName})
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-600">
              <span className="flex items-center gap-1 font-semibold text-[#1B4332]">
                <MapPin className="w-4 h-4 text-[#C98A2C]" />
                {destination.district}, Karnataka
              </span>
              <span>·</span>
              <span>Region: {destination.region}</span>
              <span>·</span>
              <span className="font-medium text-neutral-800">{destination.category}</span>
            </div>

            <p className="mt-4 text-base text-neutral-700 leading-relaxed">
              {destination.detailedDescription}
            </p>
          </div>

          {/* Fast Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#F8F7F2] rounded-xl border border-neutral-200/70">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  Best Time to Visit
                </div>
                <div className="text-xs font-semibold text-neutral-900 mt-0.5">
                  {destination.bestTimeToVisit}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  Ideal Duration
                </div>
                <div className="text-xs font-semibold text-neutral-900 mt-0.5">
                  {destination.approximateDuration}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Ticket className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  Entry & Timings
                </div>
                <div className="text-xs font-semibold text-neutral-900 mt-0.5">
                  {destination.entryFee}
                </div>
                <div className="text-[11px] text-neutral-500">{destination.timings}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Train className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  Nearest Transit Hub
                </div>
                <div className="text-xs font-semibold text-neutral-900 mt-0.5">
                  {destination.nearestHub}
                </div>
              </div>
            </div>
          </div>

          {/* Live Google Maps Place Intel & Timings Grounding */}
          <GoogleMapsPlaceIntel destination={destination} />

          {/* Things to Do & Nearby */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-neutral-200 bg-white space-y-3">
              <h3 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1B4332]" />
                Top Things to Experience
              </h3>
              <ul className="space-y-2">
                {destination.thingsToDo.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-neutral-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 bg-white space-y-3">
              <h3 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C98A2C]" />
                Nearby Attractions
              </h3>
              <div className="flex flex-wrap gap-2">
                {destination.nearbyAttractions.map((attr, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-200"
                  >
                    {attr}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Traveler Local Etiquette & Tips
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {destination.travelTips.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Available Local Guides for this Destination */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-neutral-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1B4332]" />
                  Local Guides Covering {destination.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Connect directly with verified local guides without middleman fees.
                </p>
              </div>
            </div>

            {matchedGuides.length === 0 ? (
              <div className="p-6 bg-neutral-50 rounded-xl text-center border border-neutral-200">
                <p className="text-xs text-neutral-600">
                  We are currently accrediting new guides in {destination.district}. You can still send a general request to Karnataka regional guides!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-[#1B4332]/40 transition-colors flex items-start gap-4"
                  >
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover shrink-0 border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif font-bold text-sm text-neutral-900 truncate">
                          {guide.name}
                        </h4>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          ★ {guide.rating}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{guide.badgeTitle}</p>
                      <div className="mt-2 text-[11px] text-neutral-600">
                        ₹{guide.hourlyRate}/hr · ₹{guide.dailyRate}/day
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onBookGuide(guide, destination)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-md transition-colors cursor-pointer"
                        >
                          Request Guide
                        </button>
                        <button
                          type="button"
                          onClick={() => onContactGuide(guide)}
                          className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Contact</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tourist Photo Contribution Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-lg font-bold">
                Have you explored {destination.name}?
              </h4>
              <p className="text-xs text-neutral-200">
                Share your favorite photograph with our community and credit your local guide.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onUploadPhoto(destination);
              }}
              className="px-4 py-2 text-xs font-bold text-[#1B4332] bg-white rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-[#C98A2C]" />
              <span>Upload Travel Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white text-xs z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="font-serif font-bold text-base text-white">
                {destination.name}
              </span>
              <span className="mx-2 text-white/40">|</span>
              <span className="font-mono text-white/70">
                Photo {lightboxIdx + 1} of {galleryImages.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Image Stage with Previous & Next */}
          <div
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
                }
                className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-colors"
                title="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Current Full Image */}
            <div className="max-h-[75vh] max-w-full flex items-center justify-center">
              <img
                src={galleryImages[lightboxIdx]?.url || galleryImages[lightboxIdx]?.image_url}
                alt={`${destination.name} photo ${lightboxIdx + 1}`}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Next Button */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx((prev) => (prev + 1) % galleryImages.length)
                }
                className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-colors"
                title="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer with Attribution */}
          <div
            className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white/90 text-xs font-mono bg-black/50 p-3 rounded-xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="truncate text-center sm:text-left">
              <span>Photo: </span>
              <strong className="text-white">
                {galleryImages[lightboxIdx]?.author || 'Wikimedia Contributor'}
              </strong>
              <span> · Wikimedia Commons · </span>
              <span className="text-emerald-300">
                {galleryImages[lightboxIdx]?.license || 'CC BY-SA 4.0'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {(galleryImages[lightboxIdx]?.sourceUrl || galleryImages[lightboxIdx]?.source_url) && (
                <a
                  href={galleryImages[lightboxIdx]?.sourceUrl || galleryImages[lightboxIdx]?.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#E8B960] hover:text-white font-semibold transition-colors"
                >
                  <span>Open Wikimedia Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
