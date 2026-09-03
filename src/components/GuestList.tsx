import React, { useState } from 'react';
import { JainEventItem } from '../types';
import { Users, Search, Trash2, Building, ShieldCheck, Heart, X } from 'lucide-react';

interface GuestListProps {
  event: JainEventItem;
  currentGuestId?: string;
  isOrganizer: boolean;
  onRemoveGuestByOrganizer: (guestId: string) => Promise<void>;
  onCancelMyAttendance?: (guestId: string) => Promise<void>;
}

export const GuestList: React.FC<GuestListProps> = ({
  event,
  currentGuestId,
  isOrganizer,
  onRemoveGuestByOrganizer,
  onCancelMyAttendance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancellingMine, setCancellingMine] = useState(false);

  const filteredGuests = event.guests.filter((g) => {
    const term = searchTerm.toLowerCase();
    return (
      g.name.toLowerCase().includes(term) ||
      g.hallOfResidence.toLowerCase().includes(term) ||
      (g.phone && g.phone.toLowerCase().includes(term))
    );
  });

  // Calculate hall breakdown
  const hallCounts: Record<string, number> = {};
  for (const g of event.guests) {
    const hall = g.hallOfResidence || 'Other';
    hallCounts[hall] = (hallCounts[hall] || 0) + 1;
  }

  const handleRemove = async (guestId: string, guestName: string) => {
    if (!window.confirm(`Organizer confirmation: Remove "${guestName}" from the guest list?`)) {
      return;
    }
    setRemovingId(guestId);
    try {
      await onRemoveGuestByOrganizer(guestId);
    } catch (e) {
      console.error(e);
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancelMine = async (guestId: string) => {
    if (!window.confirm('Are you sure you want to cancel your attendance for this event? You can always join again later.')) {
      return;
    }
    setCancellingMine(true);
    try {
      if (onCancelMyAttendance) {
        await onCancelMyAttendance(guestId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCancellingMine(false);
    }
  };

  return (
    <div id="guest-list-card" className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-5 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Sangha Devotees</span>
              <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-700/40">
                {event.guests.length} Attending
              </span>
            </h2>
            <p className="text-2xs sm:text-xs text-neutral-500 dark:text-neutral-400">
              Live attendance list for temple visit & transport coordination
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
          <input
            id="search-guests-input"
            type="text"
            placeholder="Search by name or hall..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
          />
        </div>
      </div>

      {/* Hall Summary Pills */}
      {Object.keys(hallCounts).length > 0 && (
        <div className="space-y-1.5">
          <span className="text-2xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Hall Attendance:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(hallCounts).map(([hall, count]) => (
              <span
                key={hall}
                className="text-2xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-lg flex items-center gap-1 font-medium"
              >
                <Building className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{hall}:</span>
                <strong className="text-neutral-900 dark:text-white">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Devotees List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 space-y-2">
            <Heart className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <p className="text-xs">No devotees match your search.</p>
          </div>
        ) : (
          filteredGuests.map((guest, idx) => {
            const isCurrentUser = currentGuestId === guest.id;
            const isHost = guest.name.includes('(Organizer)') || guest.id === event.guests[0]?.id;

            return (
              <div
                key={guest.id}
                id={`guest-item-${guest.id}`}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrentUser
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-200 dark:ring-emerald-800/60'
                    : 'bg-neutral-50/60 dark:bg-neutral-800/60 border-neutral-200/80 dark:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isHost
                        ? 'bg-amber-500 text-white'
                        : isCurrentUser
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {guest.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-2xs bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.5 rounded-md font-semibold">
                          You
                        </span>
                      )}
                      {isHost && (
                        <span className="text-2xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Organizer</span>
                        </span>
                      )}
                    </div>

                    <p className="text-2xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5 truncate">
                      <span>{guest.hallOfResidence}</span>
                      {guest.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-amber-800 dark:text-amber-300 truncate">"{guest.notes}"</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-2xs text-neutral-400 dark:text-neutral-500 hidden sm:inline-block">
                    {new Date(guest.joinedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {/* User can cancel their own presence from the list */}
                  {isCurrentUser && !isHost && onCancelMyAttendance && (
                    <button
                      id={`btn-cancel-my-guest-${guest.id}`}
                      type="button"
                      onClick={() => handleCancelMine(guest.id)}
                      disabled={cancellingMine}
                      title="Cancel your attendance"
                      className="px-2 py-1 text-2xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <X className="w-3 h-3" />
                      <span>{cancellingMine ? 'Cancelling...' : 'Cancel Attendance'}</span>
                    </button>
                  )}

                  {/* Organizer can remove a guest */}
                  {isOrganizer && !isHost && (
                    <button
                      id={`btn-remove-guest-${guest.id}`}
                      type="button"
                      onClick={() => handleRemove(guest.id, guest.name)}
                      disabled={removingId === guest.id}
                      title="Organizer: Remove guest"
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 text-center text-2xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
        <span>🙏 Everyone with the link can view attendance. Only the organizer can modify or remove guests.</span>
      </div>
    </div>
  );
};
