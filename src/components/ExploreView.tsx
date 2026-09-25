import React from 'react';
import { Compass, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Destination } from '../types';
import { AttributedImage } from './AttributedImage';

interface ExploreViewProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onSelectCategory: (category: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  destinations,
  onSelectDestination,
  onSelectCategory,
}) => {
  const circuits = [
    {
      id: 'unesco',
      title: 'The Great UNESCO Stone Dynasties',
      kannadaSubtitle: 'ವಿಶ್ವ ಪರಂಪರೆಯ ತಾಣಗಳು',
      description:
        'Witness monolithic wonders of the Vijayanagara Empire, intricately carved Hoysala soapstone shrines, and 6th-century Chalukyan rock-cut caves.',
      destIds: ['hampi', 'pattadakal', 'badami', 'belur', 'halebidu'],
      category: 'Heritage',
      bgClass: 'from-[#1B4332] to-[#0B241B]',
    },
    {
      id: 'ghats',
      title: 'Western Ghats Coffee & Rainforest Trails',
      kannadaSubtitle: 'ಮಲೆನಾಡು ಮತ್ತು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು',
      description:
        'Trek mist-shrouded peaks, taste single-estate Arabica in Coorg & Chikmagalur, and explore rainforest biodiversity in the King Cobra capital Agumbe.',
      destIds: ['coorg', 'chikmagalur', 'kudremukh', 'agumbe', 'sakleshpur'],
      category: 'Hill Stations',
      bgClass: 'from-[#194030] to-[#122E23]',
    },
    {
      id: 'coastal',
      title: 'Karavali Arabian Sea & Cliffside Beaches',
      kannadaSubtitle: 'ಕರಾವಳಿ ತೀರಗಳು',
      description:
        'Hike between secluded rocky coves in Gokarna, marvel at the 123ft Shiva colossus at Murudeshwar, and discover hexagonal volcanic pillars on St. Mary’s Islands.',
      destIds: ['gokarna', 'murudeshwar', 'maravanthe', 'udupi', 'st-marys-islands'],
      category: 'Beaches',
      bgClass: 'from-[#133C3A] to-[#0A2423]',
    },
    {
      id: 'wildlife',
      title: 'Southern Tiger Corridors & Elephant Havens',
      kannadaSubtitle: 'ವನ್ಯಜೀವಿ ಧಾಮಗಳು',
      description:
        'Boat safaris along the backwaters of Kabini, dense teak jungle tracking in Bandipur & Nagarhole, and Class 3 white-water rafting in Dandeli.',
      destIds: ['kabini', 'bandipur', 'nagarhole', 'dandeli'],
      category: 'Wildlife',
      bgClass: 'from-[#283618] to-[#141D0D]',
    },
  ];

  return (
    <div className="py-12 bg-[#FBFBF9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
            Curated Karnataka Itineraries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-2">
            Signature Travel Circuits
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            Handpicked journeys crafted by Karnataka historians and naturalists to help you experience the state beyond standard tourist stops.
          </p>
        </div>

        {/* Circuits Bento Flow */}
        <div className="space-y-12">
          {circuits.map((circuit, index) => {
            const circuitDests = circuit.destIds
              .map((id) => destinations.find((d) => d.id === id))
              .filter((d): d is Destination => Boolean(d));

            return (
              <div
                key={circuit.id}
                className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6"
              >
                {/* Circuit Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#1B4332] font-semibold">
                      <span>Circuit #{index + 1}</span>
                      <span>·</span>
                      <span>{circuit.kannadaSubtitle}</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
                      {circuit.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-3xl">
                      {circuit.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCategory(circuit.category)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <span>View all {circuit.category}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Destination thumbnails horizontal / grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {circuitDests.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => onSelectDestination(dest)}
                      className="group bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 hover:border-[#1B4332]/50 transition-all cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <AttributedImage
                          image={dest.image}
                          alt={dest.name}
                          aspectRatio="auto"
                          className="w-full h-full"
                          attributionPlacement="minimal-pill"
                          fallbackTitle={dest.name}
                        />
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-serif font-bold text-sm text-neutral-900 group-hover:text-[#1B4332] transition-colors">
                            {dest.name}
                          </div>
                          <div className="text-[11px] text-neutral-500">{dest.district}</div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-neutral-200/50 flex items-center justify-between text-[11px] text-[#1B4332] font-semibold">
                          <span>Explore Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
