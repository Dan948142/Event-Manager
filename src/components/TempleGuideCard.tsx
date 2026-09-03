import React, { useState } from 'react';
import { JainEventItem } from '../types';
import { JAIN_QUOTES } from '../data/jainQuotes';
import { Sparkles, Info, Phone, Heart, CheckCircle2, Instagram, ExternalLink } from 'lucide-react';
import deepamImage from '../assets/images/jain_deepam_aarti_1788451675317.jpg';

interface TempleGuideCardProps {
  event: JainEventItem;
}

export const TempleGuideCard: React.FC<TempleGuideCardProps> = ({ event }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quote = JAIN_QUOTES[quoteIdx];

  const guidelinesList = event.guidelines
    ? event.guidelines.split('\n').filter((l) => l.trim().length > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Sacred Quote of the Day Banner */}
      <div className="bg-linear-to-br from-amber-500/10 via-amber-100/40 to-orange-500/10 dark:from-amber-950/30 dark:via-neutral-900 dark:to-orange-950/20 border border-amber-200/90 dark:border-amber-700/40 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Sacred Tirthankara Teaching</span>
          </div>
          <button
            type="button"
            onClick={() => setQuoteIdx((prev) => (prev + 1) % JAIN_QUOTES.length)}
            className="text-2xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline"
          >
            Next Teaching →
          </button>
        </div>

        <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white font-serif leading-relaxed mb-1">
          "{quote.sanskrit}"
        </p>
        {quote.hindiTranslation && (
          <p className="text-xs text-amber-950/80 dark:text-amber-200/80 mb-2 italic">
            {quote.hindiTranslation}
          </p>
        )}
        <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {quote.englishTranslation}
        </p>

        <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-neutral-800 flex items-center justify-between text-2xs text-amber-800 dark:text-amber-400 font-medium">
          <span>Source: {quote.source}</span>
          <span className="text-amber-700 dark:text-amber-400">Ahimsa Paramo Dharma</span>
        </div>
      </div>

      {/* Temple Darshan Guidelines & Description Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
        <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Temple Visit Details & Etiquette
          </h2>
        </div>

        {/* Event Description */}
        {event.description && (
          <div className="space-y-1">
            <h3 className="text-2xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
              About This Event
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line bg-amber-50/40 dark:bg-neutral-800/70 p-3.5 rounded-2xl border border-amber-100 dark:border-neutral-700">
              {event.description}
            </p>
          </div>
        )}

        {/* Deepam Aarti Image & Guidelines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-4">
            <div className="rounded-2xl overflow-hidden border border-amber-200 dark:border-neutral-700 aspect-4/3 sm:aspect-square relative shadow-xs">
              <img
                src={deepamImage}
                alt="Sacred Deepam & Marigold Aarti"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-2.5">
                <span className="text-2xs text-white font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Devotion & Shanti</span>
                </span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-8 space-y-2">
            <h3 className="text-2xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
              Darshan & Temple Guidelines
            </h3>
            {guidelinesList.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {guidelinesList.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                Standard Jain temple etiquette applies. White/light attire, no leather or footwear in temple premises.
              </p>
            )}
          </div>
        </div>

        {/* Organizer Help Contact */}
        <div className="bg-neutral-50 dark:bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-2xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
              Event Organizer
            </span>
            <p className="font-bold text-neutral-900 dark:text-white">{event.organizerName}</p>
          </div>

          {event.organizerPhone && (
            <a
              href={`tel:${event.organizerPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 bg-amber-100/70 dark:bg-amber-900/40 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-center"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{event.organizerPhone}</span>
            </a>
          )}
        </div>

        {/* Community Sangha Connection (Jain Samaj IIT Kharagpur) */}
        <div
          id="community-callout-guide"
          className="bg-linear-to-r from-amber-500/10 via-rose-500/10 to-orange-500/10 dark:from-neutral-850 dark:via-neutral-800 dark:to-neutral-850 p-4 rounded-2xl border border-amber-200/90 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs shrink-0">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Jain Samaj IIT Kharagpur
                </h4>
                <span className="text-2xs text-rose-700 dark:text-rose-400 font-semibold">
                  @jainsamaj_iitkgp
                </span>
              </div>
              <p className="text-2xs text-neutral-600 dark:text-neutral-400">
                Follow our community on Instagram for daily temple updates, stavan & campus gatherings
              </p>
            </div>
          </div>

          <a
            id="btn-instagram-temple-guide"
            href="https://www.instagram.com/jainsamaj_iitkgp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold rounded-xl shadow-2xs transition-all self-start sm:self-center shrink-0 hover:scale-102"
          >
            <Instagram className="w-3.5 h-3.5 text-rose-500" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
