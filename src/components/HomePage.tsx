import React, { useState } from 'react';
import { JainEventItem, UserLocalProfile } from '../types';
import { JAIN_EVENT_TYPES } from '../data/jainQuotes';
import { ThemeToggle } from './ThemeToggle';
import mandirBgImage from '../assets/images/jain_mandir_temple_1788453750542.jpg';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  Search,
  Plus,
  ArrowRight,
  Share2,
  CheckCircle2,
  Sparkles,
  Instagram,
  ExternalLink,
} from 'lucide-react';

interface HomePageProps {
  events: JainEventItem[];
  userProfile: UserLocalProfile | null;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateModal: () => void;
  onShareEvent: (event: JainEventItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  events,
  userProfile,
  onSelectEvent,
  onOpenCreateModal,
  onShareEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.templeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'All' || e.eventType.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-stone-100/90 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      {/* Full-Page Background Jain Mandir Image (Slightly Transparent) */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <img
          src={mandirBgImage}
          alt="Jain Mandir Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-20 dark:opacity-15 filter contrast-105"
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-50/80 via-stone-50/70 to-stone-100/90 dark:from-neutral-950/85 dark:via-neutral-950/80 dark:to-neutral-950/90 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Banner Navigation */}
        <header className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-700 dark:via-amber-800 dark:to-orange-900 text-white py-2.5 px-4 sm:px-6 shadow-xs">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-100 dark:text-amber-200 tracking-wide text-sm sm:text-base flex items-center gap-1.5">
                <span>🙏</span>
                <span>Jain Sangha Activities</span>
              </span>
              <span className="hidden md:inline-block text-amber-200/70">•</span>
              <span className="hidden md:inline-block text-amber-100/90 text-2xs italic font-serif">
                अहिंसा परमो धर्मः • परस्परोपग्रहो जीवानाम्
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Instagram Community Link */}
              <a
                id="btn-instagram-header"
                href="https://www.instagram.com/jainsamaj_iitkgp/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 sm:px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border border-white/20 hover:scale-102"
                title="Follow Jain Samaj IIT Kharagpur on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-200" />
                <span className="hidden sm:inline">Jain Samaj IIT KGP</span>
                <span className="sm:hidden">@jainsamaj_iitkgp</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>

              <ThemeToggle />

              <button
                id="btn-home-create-header"
                type="button"
                onClick={onOpenCreateModal}
                className="px-3 py-1.5 bg-white dark:bg-neutral-800 text-amber-900 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-neutral-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post New Event</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
          {/* Serene Welcome Banner */}
          <div
            id="home-hero-banner"
            className="relative overflow-hidden rounded-3xl border border-amber-300/80 dark:border-amber-700/50 p-6 sm:p-10 shadow-xs text-neutral-900 dark:text-neutral-100 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-sm"
          >
            <div className="relative z-10 max-w-2xl space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-200/80 dark:border-amber-700/50 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pavitra Darshan & Sangha Coordination</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-serif drop-shadow-2xs">
                Jain Religious Activities & Temple Darshan
              </h1>

              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                Connect with fellow students, scholars, and campus devotees for temple visits, morning puja & abhishek, and festive sangha gatherings at IIT Kharagpur. Select any event below to view details and join with your hall.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="btn-home-create-banner"
                  type="button"
                  onClick={onOpenCreateModal}
                  className="px-5 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 hover:scale-102"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Event</span>
                </button>

                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {events.length === 0
                    ? 'No events scheduled yet'
                    : `${events.length} active Sangha ${events.length === 1 ? 'gathering' : 'gatherings'}`}
                </span>

                {/* Device-Remembered Devotee Indicator */}
                {userProfile && (
                  <div
                    id="user-device-identity-badge"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200"
                    title="Your name and hall are saved on this device for 1-click joining"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>Device ready as: <strong>{userProfile.name}</strong> ({userProfile.hallOfResidence})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Jain Samaj IIT Kharagpur Community Follow Banner */}
        <div
          id="community-instagram-card"
          className="bg-linear-to-r from-amber-50 via-rose-50/50 to-orange-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-850 border border-amber-200/90 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Instagram className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-900/50">
                  Official Community
                </span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  @jainsamaj_iitkgp
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Jain Samaj IIT Kharagpur
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                Connect with Jain students, scholars, and campus families at IIT Kharagpur. Follow our page for temple visit updates, festival dates, and community announcements.
              </p>
            </div>
          </div>

          <a
            id="btn-follow-instagram-hero"
            href="https://www.instagram.com/jainsamaj_iitkgp/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-5 py-2.5 bg-linear-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-700 hover:via-rose-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-102"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                id="home-search-input"
                type="text"
                placeholder="Search by temple name, title, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 shadow-2xs"
              />
            </div>

            {/* Total Count */}
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 self-end sm:self-center">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>

          {/* Activity Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedType('All')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                selectedType === 'All'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              All Gatherings
            </button>
            {JAIN_EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  selectedType === type
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Events Cards Grid */}
        {events.length === 0 ? (
          <div
            id="home-no-events-state"
            className="text-center py-14 px-6 bg-white dark:bg-neutral-900 rounded-3xl border border-amber-200/80 dark:border-neutral-800 shadow-xs max-w-lg mx-auto space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                No Temple Events Scheduled Yet
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Be the first organizer to schedule an upcoming temple visit, morning puja & abhishek, or sangha gathering for IIT Kharagpur devotees.
              </p>
            </div>
            <div className="pt-2">
              <button
                id="btn-home-empty-post"
                type="button"
                onClick={onOpenCreateModal}
                className="px-5 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>Post First Event</span>
              </button>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              No Sangha events found matching your criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All');
              }}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => {
              const eventDate = new Date(evt.dateTime);
              const formattedDate = eventDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = eventDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });
              const isUserAttending =
                userProfile && evt.guests.some((g) => g.id === userProfile.guestId);

              return (
                <div
                  key={evt.id}
                  id={`home-event-card-${evt.id}`}
                  className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-200/80 dark:border-neutral-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-400 dark:hover:border-amber-600"
                >
                  <div className="space-y-3">
                    {/* Top Row: Type & Devotees Count */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-700/40">
                        {evt.eventType}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isUserAttending && (
                          <span className="text-2xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Attending</span>
                          </span>
                        )}

                        <span className="text-2xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>{evt.guests.length}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2
                      onClick={() => onSelectEvent(evt.id)}
                      className="text-base font-bold text-neutral-900 dark:text-white line-clamp-2 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer transition-colors"
                    >
                      {evt.title}
                    </h2>

                    {/* Temple & Venue */}
                    <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-300">
                        <Building className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{evt.templeName}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-2xs text-neutral-500 dark:text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </div>
                    </div>

                    {/* Date & Time pill */}
                    <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/60 border border-amber-200/50 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-medium">
                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onShareEvent(evt)}
                      title="Share link"
                      className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-open-event-${evt.id}`}
                      type="button"
                      onClick={() => onSelectEvent(evt.id)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs group-hover:bg-amber-700"
                    >
                      <span>View Event & Join</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-serif font-medium">🙏 Jain Samaj IIT Kharagpur • Temple Darshan & Sangha</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <a
              id="footer-instagram-home"
              href="https://www.instagram.com/jainsamaj_iitkgp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Jain Samaj IIT Kharagpur (@jainsamaj_iitkgp)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>

            <button
              onClick={onOpenCreateModal}
              className="text-amber-700 dark:text-amber-400 hover:underline"
            >
              + Post New Event
            </button>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
};
