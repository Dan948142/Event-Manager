import React from 'react';
import { JainEventItem } from '../types';
import { ThemeToggle } from './ThemeToggle';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  QrCode,
  ShieldCheck,
  Edit3,
  CalendarPlus,
  Compass,
  Building,
  ArrowLeft,
  Instagram,
  ExternalLink,
} from 'lucide-react';

// Hero image generated
import templeHeroImage from '../assets/images/jain_temple_hero_1788451657973.jpg';

interface EventHeaderProps {
  event: JainEventItem;
  isConnected: boolean;
  isOrganizer: boolean;
  onBackToHome: () => void;
  onOpenShareModal: () => void;
  onOpenQRModal: () => void;
  onOpenCreateModal: () => void;
  onBrowseEvents: () => void;
  onOpenEditEvent: () => void;
  onOpenOrganizerAuth: () => void;
  onLeaveOrganizerMode: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  isConnected,
  isOrganizer,
  onBackToHome,
  onOpenShareModal,
  onOpenQRModal,
  onOpenCreateModal,
  onBrowseEvents,
  onOpenEditEvent,
  onOpenOrganizerAuth,
  onLeaveOrganizerMode,
}) => {
  const eventDate = new Date(event.dateTime);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header id="jain-event-header" className="relative bg-white dark:bg-neutral-900 border-b border-amber-200/80 dark:border-neutral-800 shadow-xs transition-colors">
      {/* Top Banner Navigation */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-700 dark:via-amber-800 dark:to-orange-900 text-white py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-home"
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/20 hover:bg-black/35 text-white font-medium text-2xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Events</span>
            </button>

            <span className="font-serif font-bold text-amber-100 tracking-wide flex items-center gap-1.5">
              <span>🙏</span>
              <span>Jain Sangha & Temple Darshan</span>
            </span>
            <span className="hidden md:inline-block text-amber-200/70">•</span>
            <span className="hidden md:inline-block text-amber-100/90 text-2xs italic font-serif">
              अहिंसा परमो धर्मः • परस्परोपग्रहो जीवानाम्
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Instagram Community Link */}
            <a
              id="btn-instagram-event-header"
              href="https://www.instagram.com/jainsamaj_iitkgp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xs font-semibold text-white hover:text-white bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 border border-white/25 hover:scale-102"
              title="Follow Jain Samaj IIT Kharagpur on Instagram"
            >
              <Instagram className="w-3 h-3 text-pink-200" />
              <span className="hidden sm:inline">Jain Samaj IIT KGP</span>
              <span className="sm:hidden">@jainsamaj_iitkgp</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            {/* Dark mode toggle */}
            <ThemeToggle />

            {/* Live SSE badge */}
            <div
              id="live-sync-indicator"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 text-white text-2xs font-medium"
              title={isConnected ? 'Connected to live updates' : 'Connecting...'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'
                }`}
              />
              <span>{isConnected ? 'Live Sync' : 'Connecting'}</span>
            </div>

            {/* Organizer Status */}
            {isOrganizer ? (
              <div className="flex items-center gap-2">
                <span
                  id="organizer-badge"
                  className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold text-2xs flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>Organizer Mode</span>
                </span>
                <button
                  id="btn-leave-organizer"
                  type="button"
                  onClick={onLeaveOrganizerMode}
                  className="text-2xs text-amber-200 hover:text-white underline underline-offset-2"
                >
                  Exit Mode
                </button>
              </div>
            ) : (
              <button
                id="btn-organizer-login"
                type="button"
                onClick={onOpenOrganizerAuth}
                className="text-2xs font-medium text-amber-100 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Organizer Login</span>
              </button>
            )}

            <button
              id="btn-all-events-nav"
              type="button"
              onClick={onBrowseEvents}
              className="text-2xs text-amber-100 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Event Showcase Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Event Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <a
                id="header-community-tag"
                href="https://www.instagram.com/jainsamaj_iitkgp/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-colors"
                title="Follow Jain Samaj IIT Kharagpur on Instagram"
              >
                <Instagram className="w-3 h-3 text-rose-500" />
                <span>Jain Samaj IIT Kharagpur</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>

              <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700/50 flex items-center gap-1">
                <span>🕉️</span>
                <span>{event.eventType}</span>
              </span>

              <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {event.guests.length} Confirmed {event.guests.length === 1 ? 'Devotee' : 'Devotees'}
              </span>

              {isOrganizer && (
                <span className="bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  <span>Can Edit Timings & Guests</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 id="event-title-display" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight font-serif">
                {event.title}
              </h1>
              <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-amber-900 dark:text-amber-300">
                <Building className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{event.templeName}</span>
              </div>
            </div>

            {/* Date, Time & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/80 border border-amber-200/70 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">Date & Day</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/80 border border-amber-200/70 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">Puja / Darshan Time</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{formattedTime}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{event.location}</span>
            </div>

            {/* Buttons Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              <button
                id="btn-share-header"
                type="button"
                onClick={onOpenShareModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Invitation</span>
              </button>

              <button
                id="btn-qr-header"
                type="button"
                onClick={onOpenQRModal}
                className="px-3.5 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>Temple QR Code</span>
              </button>

              {isOrganizer && (
                <button
                  id="btn-edit-event-header"
                  type="button"
                  onClick={onOpenEditEvent}
                  className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Edit Timings & Details</span>
                </button>
              )}

              <button
                id="btn-post-new-event-header"
                type="button"
                onClick={onOpenCreateModal}
                className="px-3.5 py-2 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-neutral-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ml-auto"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Post New Event</span>
              </button>
            </div>
          </div>

          {/* Right: Peaceful Temple Image Showcase */}
          <div className="lg:col-span-4 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-amber-200/90 dark:border-neutral-700 aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 group">
              <img
                src={templeHeroImage}
                alt="Jain Temple Derasar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-2xs uppercase tracking-widest text-amber-300 font-semibold">
                  Pavitra Jinalaya
                </span>
                <p className="text-xs font-medium text-amber-100 line-clamp-1">
                  {event.templeName}
                </p>
                <p className="text-2xs text-neutral-300 mt-0.5">
                  Organized with devotion by {event.organizerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
