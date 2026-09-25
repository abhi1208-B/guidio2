import React, { useState, useEffect } from 'react';
import { ExternalLink, Info, ImageOff, ZoomIn } from 'lucide-react';
import { WikimediaImage } from '../types';

interface AttributedImageProps {
  image?: WikimediaImage;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide' | 'auto';
  showAttributionOverlay?: boolean;
  attributionPlacement?: 'bottom-overlay' | 'caption-below' | 'minimal-pill';
  fallbackTitle?: string;
  fallbackCategory?: string;
  priority?: boolean;
  onClick?: () => void;
  showZoomIcon?: boolean;
}

export const AttributedImage: React.FC<AttributedImageProps> = ({
  image,
  alt,
  className = '',
  aspectRatio = 'auto',
  showAttributionOverlay = true,
  attributionPlacement = 'bottom-overlay',
  fallbackTitle,
  fallbackCategory,
  priority = false,
  onClick,
  showZoomIcon = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAttributionModal, setShowAttributionModal] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  // Generate candidate URLs (thumbnail, unscaled upload URL, etc.)
  const candidateUrls: string[] = React.useMemo(() => {
    if (!image) return [];
    const urls: string[] = [];
    const primary = image.url || image.image_url;
    if (primary) urls.push(primary);

    // If it's a thumb.wikimedia.org URL, derive upload.wikimedia.org direct URL as backup
    if (primary && primary.includes('/thumb/')) {
      try {
        const parts = primary.split('/thumb/');
        if (parts[1]) {
          const directPart = parts[1].substring(0, parts[1].lastIndexOf('/'));
          if (directPart) {
            urls.push(`https://upload.wikimedia.org/wikipedia/commons/${directPart}`);
          }
        }
      } catch {}
    }

    return Array.from(new Set(urls));
  }, [image]);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    setCurrentUrlIndex(0);
  }, [image?.url, image?.image_url]);

  const activeUrl = candidateUrls[currentUrlIndex];

  const handleImageError = () => {
    // If we have another candidate URL to try, try it!
    if (currentUrlIndex + 1 < candidateUrls.length) {
      setCurrentUrlIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : '';

  const author = image?.author || 'Wikimedia Contributor';
  const license = image?.license || 'CC BY-SA 4.0';
  const sourceUrl = image?.sourceUrl || image?.source_url || 'https://commons.wikimedia.org';
  const attributionText = `Photo: ${author} · Wikimedia Commons · ${license}`;

  // Image unavailable placeholder when no image or after all candidates fail
  if (!activeUrl || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-neutral-100 border border-neutral-200 text-neutral-600 flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-neutral-200/80 flex items-center justify-center mb-2">
          <ImageOff className="w-6 h-6 text-neutral-400" />
        </div>
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Image unavailable
        </div>
        <h4 className="font-serif font-bold text-sm text-neutral-800 mt-1">
          {fallbackTitle || alt}
        </h4>
        <p className="text-[11px] text-neutral-500 mt-0.5">
          {fallbackCategory || 'Karnataka Destination'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative group overflow-hidden ${aspectClass} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center z-5">
          <span className="text-[11px] font-mono text-neutral-500">Loading Wikimedia photograph...</span>
        </div>
      )}

      {/* Main Image */}
      <img
        src={activeUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Optional Hover Zoom Icon */}
      {showZoomIcon && (
        <div className="absolute top-3 right-3 bg-black/50 hover:bg-black/75 backdrop-blur-xs text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Attribution Overlay Options */}
      {showAttributionOverlay && attributionPlacement === 'bottom-overlay' && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 pt-6 text-white text-[11px] opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-between pointer-events-auto">
          <span className="truncate pr-2 font-mono text-[10.5px] text-white/95">
            {attributionText}
          </span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View source on Wikimedia Commons"
              className="inline-flex items-center gap-1 text-[10px] text-[#E8B960] hover:text-white shrink-0 transition-colors font-medium bg-black/40 px-1.5 py-0.5 rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {showAttributionOverlay && attributionPlacement === 'minimal-pill' && (
        <div className="absolute bottom-2 right-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAttributionModal(!showAttributionModal);
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white/90 rounded-sm text-[10.5px] font-mono transition-colors cursor-pointer"
            title="Image copyright & attribution info"
          >
            <Info className="w-3 h-3 text-[#E8B960]" />
            <span>Attribution</span>
          </button>

          {showAttributionModal && (
            <div
              className="absolute bottom-full right-0 mb-2 w-64 bg-neutral-900 text-white text-xs p-3 rounded shadow-xl border border-neutral-700 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-semibold text-emerald-400 mb-1">Wikimedia Commons License</div>
              <p className="text-[11px] text-neutral-300 mb-1.5">{attributionText}</p>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#E8B960] hover:underline"
              >
                <span>View Original Wikimedia Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {showAttributionOverlay && attributionPlacement === 'caption-below' && (
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span className="truncate">{attributionText}</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 hover:text-black inline-flex items-center gap-0.5 ml-2 shrink-0 underline"
          >
            License <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      )}
    </div>
  );
};
