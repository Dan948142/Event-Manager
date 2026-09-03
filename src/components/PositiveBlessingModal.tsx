import React, { useState } from 'react';
import { JainEventItem, Guest, JainQuote } from '../types';
import { JAIN_QUOTES } from '../data/jainQuotes';
import { Sparkles, Share2, Calendar, CheckCircle2, Heart, X } from 'lucide-react';

interface PositiveBlessingModalProps {
  event: JainEventItem;
  guest: Guest;
  onClose: () => void;
  onShareWhatsApp: () => void;
}

export const PositiveBlessingModal: React.FC<PositiveBlessingModalProps> = ({
  event,
  guest,
  onClose,
  onShareWhatsApp,
}) => {
  // Pick an inspiring quote or cycle through
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * JAIN_QUOTES.length)
  );

  const currentQuote: JainQuote = JAIN_QUOTES[quoteIndex] || JAIN_QUOTES[0];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % JAIN_QUOTES.length);
  };

  // Generate .ics calendar download
  const handleAddToCalendar = () => {
    try {
      const eventStart = new Date(event.dateTime);
      const eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      const formatICSDate = (date: Date) =>
        date.toISOString().replace(/-|:|\.\d+/g, '');

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Jain Samaj IIT Kharagpur//Event//EN',
        'BEGIN:VEVENT',
        `SUMMARY:🙏 ${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, ' ')}\\nTemple: ${event.templeName}`,
        `LOCATION:${event.templeName}, ${event.location}`,
        `DTSTART:${formatICSDate(eventStart)}`,
        `DTEND:${formatICSDate(eventEnd)}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error generating calendar file:', e);
    }
  };

  return (
    <div
      id="blessing-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="blessing-modal-card"
        className="relative w-full max-w-lg bg-linear-to-b from-amber-50/90 via-white to-amber-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 rounded-3xl shadow-2xl border border-amber-200/90 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors"
      >
        {/* Decorative Top Aura */}
        <div className="h-3 bg-linear-to-r from-amber-400 via-orange-400 to-amber-500" />

        <button
          id="btn-close-blessing"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-amber-100/60 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Spiritual Symbol / Icon */}
          <div className="inline-flex items-center justify-center p-4 bg-linear-to-tr from-amber-500 to-orange-500 rounded-2xl text-white shadow-lg shadow-amber-500/20 ring-4 ring-amber-100 dark:ring-amber-900/40 mx-auto animate-bounce-subtle">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest text-amber-700 dark:text-amber-300 uppercase bg-amber-100/80 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-800">
              🙏 Jai Jinendra • Confirmed Attending
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight pt-1">
              Shubh Aagman, {guest.name}!
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Your presence is joyfully recorded with the Sangha.
            </p>
          </div>

          {/* Sacred Positive Quote Card */}
          <div className="bg-amber-50/90 dark:bg-neutral-800/80 border border-amber-200/80 dark:border-neutral-700 rounded-2xl p-5 text-left relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                <span>Sacred Jain Blessing & Teaching</span>
              </span>
              <button
                type="button"
                onClick={handleNextQuote}
                className="text-2xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-medium underline underline-offset-2"
              >
                Read another quote
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-300 font-serif leading-relaxed mb-1.5">
              "{currentQuote.sanskrit}"
            </p>

            {currentQuote.hindiTranslation && (
              <p className="text-xs text-amber-900/90 dark:text-amber-200/80 mb-2 italic">
                {currentQuote.hindiTranslation}
              </p>
            )}

            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {currentQuote.englishTranslation}
            </p>

            <div className="mt-3 pt-2.5 border-t border-amber-200/60 dark:border-neutral-700 flex items-center justify-between text-2xs text-amber-700 dark:text-amber-400 font-medium">
              <span>— {currentQuote.source}</span>
              <span className="text-amber-600 dark:text-amber-400">Mangal Darshan</span>
            </div>
          </div>

          {/* Event Confirmation Summary Details */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700 text-left text-xs space-y-2 text-neutral-600 dark:text-neutral-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 dark:text-white">{event.title}</span>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {event.templeName} • {new Date(event.dateTime).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-2xs text-neutral-500 dark:text-neutral-400">
              <span>Hall: <strong className="text-neutral-800 dark:text-neutral-200">{guest.hallOfResidence}</strong></span>
              <span className="text-amber-700 dark:text-amber-400 font-medium">You can update anytime</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              id="btn-whatsapp-share-blessing"
              type="button"
              onClick={onShareWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share with Sangha</span>
            </button>

            <button
              id="btn-calendar-blessing"
              type="button"
              onClick={handleAddToCalendar}
              className="w-full py-3 px-4 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold text-xs rounded-xl border border-amber-300 dark:border-amber-800 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Add to Calendar</span>
            </button>
          </div>

          <button
            id="btn-done-blessing"
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Jai Jinendra • Continue to Event Page
          </button>
        </div>
      </div>
    </div>
  );
};
