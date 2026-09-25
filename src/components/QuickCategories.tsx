import React from 'react';
import {
  Landmark,
  Waves,
  Sun,
  Mountain,
  TreePine,
  Sparkles,
  Shield,
  Compass,
  Palette,
  Utensils,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { DestinationCategory } from '../types';

interface QuickCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const QuickCategories: React.FC<QuickCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (name: string) => {
    const props = { className: 'w-5 h-5' };
    switch (name) {
      case 'Landmark':
        return <Landmark {...props} />;
      case 'Waves':
        return <Waves {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Mountain':
        return <Mountain {...props} />;
      case 'TreePine':
        return <TreePine {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Shield':
        return <Shield {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Palette':
        return <Palette {...props} />;
      case 'Utensils':
        return <Utensils {...props} />;
      case 'MapPin':
        return <MapPin {...props} />;
      default:
        return <Compass {...props} />;
    }
  };

  return (
    <section className="py-12 bg-[#F6F4ED] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
              Explore By Vibe
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Karnataka Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#1B4332] text-white'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            Show All 42+ Places
          </button>
        </div>

        {/* Visual Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? 'bg-white/15 text-[#E8B960]' : 'bg-[#EFECE6] text-[#1B4332]'
                  }`}
                >
                  {getIcon(cat.iconName)}
                </div>

                <div className="font-semibold text-sm leading-tight flex items-baseline justify-between">
                  <span>{cat.name}</span>
                </div>

                <div
                  className={`text-[11px] font-medium mt-1 ${
                    isSelected ? 'text-emerald-200' : 'text-neutral-500'
                  }`}
                >
                  {cat.kannadaName}
                </div>

                <div
                  className={`mt-2 text-[11px] font-mono ${
                    isSelected ? 'text-white/70' : 'text-neutral-400'
                  }`}
                >
                  {cat.count} places
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
