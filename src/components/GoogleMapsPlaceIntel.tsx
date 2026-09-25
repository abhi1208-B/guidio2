import React, { useState } from 'react';
import { MapPin, ExternalLink, Loader2, Sparkles, Navigation, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { Destination } from '../types';

interface GoogleMapsPlaceIntelProps {
  destination: Destination;
}

export const GoogleMapsPlaceIntel: React.FC<GoogleMapsPlaceIntelProps> = ({ destination }) => {
  const [loading, setLoading] = useState(false);
  const [intelData, setIntelData] = useState<{
    text: string;
    mapsLinks: Array<{ title: string; uri: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMapsIntel = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationName: destination.name,
          district: destination.district,
          query: `Provide accurate Google Maps traveler intelligence for ${destination.name} in ${destination.district}, Karnataka. Include verified visiting hours, peak vs quiet times, best navigation entry gate or parking tip, and 2-3 notable nearby points of interest with exact Google Maps places.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not retrieve Google Maps data');
      }

      const data = await response.json();
      setIntelData({
        text: data.text || '',
        mapsLinks: data.mapsLinks || [],
      });
    } catch (err: any) {
      console.warn('Google Maps grounding notice:', err);
      setError('Live Google Maps connection currently busy. You can still use the direct Google Maps link below.');
    } finally {
      setLoading(false);
    }
  };

  const defaultMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${destination.name} ${destination.district} Karnataka`,
  )}`;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-[#F8F7F2] to-amber-50/40 border border-emerald-900/15 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-4 h-4 text-[#E8B960]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-sm text-neutral-900">
                Live Google Maps™ Intel & Grounding
              </h4>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 rounded">
                Live Data
              </span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Verified coordinates, live timings, and place links grounded via Gemini & Google Maps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!intelData && !loading && (
            <button
              type="button"
              onClick={fetchMapsIntel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8B960]" />
              <span>Load Live Maps Intel</span>
            </button>
          )}

          {intelData && (
            <button
              type="button"
              onClick={fetchMapsIntel}
              disabled={loading}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
              title="Refresh Maps Intel"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}

          <a
            href={defaultMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#1B4332] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors"
          >
            <Navigation className="w-3 h-3 text-[#C98A2C]" />
            <span>Open in Maps</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-6 bg-white/70 backdrop-blur-xs rounded-xl border border-emerald-100 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-[#1B4332] animate-spin" />
          <span className="text-xs font-medium text-neutral-700 font-mono">
            Querying Google Maps Grounding via gemini-2.5-flash...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-lg border border-amber-200">
          {error}
        </div>
      )}

      {/* Displayed Intelligence */}
      {intelData && !loading && (
        <div className="space-y-3 animate-fadeIn">
          {/* Formatted Text Intel */}
          <div className="p-4 bg-white/90 rounded-xl border border-neutral-200/80 text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
            {intelData.text}
          </div>

          {/* Extracted Google Maps Links */}
          {intelData.mapsLinks && intelData.mapsLinks.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Google Maps Verified Place Links ({intelData.mapsLinks.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {intelData.mapsLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-lg text-xs font-medium text-[#1B4332] shadow-2xs transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-[#C98A2C]" />
                    <span className="truncate max-w-[220px]">{link.title || destination.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
