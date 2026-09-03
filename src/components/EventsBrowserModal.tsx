import React, { useState } from 'react';
import { JainEventItem, UserLocalProfile } from '../types';
import { X, Calendar, Clock, MapPin, Building, Users, CalendarPlus, Search, CheckCircle2 } from 'lucide-react';

interface EventsBrowserModalProps {
  events: JainEventItem[];
  currentEventId: string;
  userProfile: UserLocalProfile | null;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateModal: () => void;
  onClose: () => void;
}

export const EventsBrowserModal: React.FC<EventsBrowserModalProps> = ({
  events,
  currentEventId,
  userProfile,
  onSelectEvent,
  onOpenCreateModal,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = events.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      e.templeName.toLowerCase().includes(term) ||
      e.location.toLowerCase().includes(term) ||
      e.eventType.toLowerCase().includes(term)
    );
  });

  return (
    <div
      id="browser-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="browser-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 max-h-[85vh] flex flex-col transition-colors"
      >
        <div className="flex items-center justify-between p-5 border-b border-amber-100 dark:border-neutral-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-neutral-850 dark:to-neutral-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Jain Sangha Religious Activities
            </h2>
            <p className="text-2xs sm:text-xs text-neutral-600 dark:text-neutral-400">
              Browse temple darshans, puja gatherings, and bhakti events
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search temple, puja, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCreateModal();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Post New Event</span>
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 dark:text-neutral-500">
              <p className="text-xs">No events found matching your search.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = item.id === currentEventId;
              const hasJoined = userProfile && item.guests.some((g) => g.id === userProfile.guestId);
              const eventDate = new Date(item.dateTime);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectEvent(item.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/20 shadow-xs'
                      : 'bg-neutral-50/50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">
                        {item.eventType}
                      </span>
                      {hasJoined && (
                        <span className="text-2xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Attending</span>
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-2xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 rounded-md">
                          Current Viewing
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300 font-medium line-clamp-1">
                      <Building className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{item.templeName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-neutral-500 dark:text-neutral-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                        <span>
                          {eventDate.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                        <span>
                          {eventDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                        <span className="truncate max-w-48">{item.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                      <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{item.guests.length} Devotees</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
