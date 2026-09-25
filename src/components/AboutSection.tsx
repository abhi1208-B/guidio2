import React from 'react';
import { Compass, Users, ShieldCheck, HeartHandshake, Map, Sparkles, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#F8F7F2] border-t border-neutral-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
            Our Purpose & Ethos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-2">
            Why We Built Guido for Karnataka
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Karnataka is one of India’s most culturally diverse and biodiverse states — spanning ancient Hoysala architecture, Vijayanagara empires, UNESCO heritage sites, misty Western Ghats coffee plantations, and Arabian Sea shorelines. Yet, travelers often miss the true soul of these places without local storytellers.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1B4332]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Direct Local Empowerment
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Traditional tour agencies often take 40-60% of guide earnings. Guido gives 100% of tour honorariums directly to verified local residents, epigraphists, and naturalists.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Verified Knowledge
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every guide on Guido holds state tourism badges, ASI archaeology accreditations, or deep multi-generational roots in their regional geography and culture.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1B4332]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Ethical Travel & Open Media
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All destination photography on Guido strictly uses openly-licensed Wikimedia Commons historical archives with full photographer attribution, respecting public heritage.
            </p>
          </div>
        </div>

        {/* Karnataka Regional Dialect & Culture Note */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#144533] to-[#1E5C45] text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E8B960]">
                One State · Many Worlds
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">
                ಸರ್ವರಿಗೂ ಸುಸ್ವಾಗತ — Welcome All to Karnataka
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 mt-2 max-w-xl leading-relaxed">
                Whether you’re tracing 6th-century rock cut sculptures in Badami, spotting tigers in Nagarhole, or sipping single-estate Arabica in Coorg, your local guide brings each stone and tree to life.
              </p>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <div className="font-serif text-3xl font-bold text-[#E8B960]">31</div>
              <div className="text-xs text-neutral-300">Districts of Karnataka</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
