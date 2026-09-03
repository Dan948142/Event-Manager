import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JainEventItem, UserLocalProfile, Guest } from './types';
import { EventHeader } from './components/EventHeader';
import { GuestJoinCard } from './components/GuestJoinCard';
import { GuestList } from './components/GuestList';
import { TempleGuideCard } from './components/TempleGuideCard';
import { HomePage } from './components/HomePage';
import { PositiveBlessingModal } from './components/PositiveBlessingModal';
import { CreateEventModal } from './components/CreateEventModal';
import { EditEventModal } from './components/EditEventModal';
import { OrganizerAuthModal } from './components/OrganizerAuthModal';
import { ShareModal } from './components/ShareModal';
import { QRCodeModal } from './components/QRCodeModal';
import { EventsBrowserModal } from './components/EventsBrowserModal';
import { Loader2, Sparkles, Building, Users, Instagram, ExternalLink } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'jain_guest_device_profile_v1';
const ORGANIZER_KEYS_STORAGE_KEY = 'jain_organizer_keys_v1';

export default function App() {
  const [events, setEvents] = useState<JainEventItem[]>([]);
  const [currentEvent, setCurrentEvent] = useState<JainEventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Target event for share modal (can be currentEvent or chosen from HomePage)
  const [shareTargetEvent, setShareTargetEvent] = useState<JainEventItem | null>(null);
  const [qrTargetEvent, setQrTargetEvent] = useState<JainEventItem | null>(null);

  // Saved guest identity on this device (No sign-in required)
  const [userProfile, setUserProfile] = useState<UserLocalProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Stored organizer keys for created events: Map<eventId, organizerKey>
  const [storedOrganizerKeys, setStoredOrganizerKeys] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(ORGANIZER_KEYS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current active organizer key (if authenticated via URL param, storage, or auth modal)
  const [activeOrganizerKey, setActiveOrganizerKey] = useState<string | null>(null);

  // Modals state
  const [showBlessingModal, setShowBlessingModal] = useState(false);
  const [blessingGuest, setBlessingGuest] = useState<Guest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBrowserModal, setShowBrowserModal] = useState(false);

  // Active view tab on mobile/tablet (Overview, Guests, Temple Guide)
  const [viewTab, setViewTab] = useState<'all' | 'guests' | 'guide'>('all');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const sseRef = useRef<EventSource | null>(null);

  // Save guest profile
  const handleUpdateProfile = useCallback((profile: UserLocalProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  }, []);

  // Save an organizer key for an event
  const saveOrganizerKey = useCallback((eventId: string, key: string) => {
    setStoredOrganizerKeys((prev) => {
      if (prev[eventId] === key) return prev;
      const updated = { ...prev, [eventId]: key };
      try {
        localStorage.setItem(ORGANIZER_KEYS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to store organizer key:', err);
      }
      return updated;
    });
    setActiveOrganizerKey((prev) => (prev === key ? prev : key));
  }, []);

  // Check URL param or stored key when event changes
  useEffect(() => {
    if (!currentEvent?.id) {
      setActiveOrganizerKey((prev) => (prev !== null ? null : prev));
      return;
    }

    const eventId = currentEvent.id;
    // 1. Check URL query param '?key='
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('key');
    if (urlKey) {
      setActiveOrganizerKey((prev) => (prev !== urlKey ? urlKey : prev));
      if (storedOrganizerKeys[eventId] !== urlKey) {
        saveOrganizerKey(eventId, urlKey);
      }
      return;
    }

    // 2. Check local stored keys
    const stored = storedOrganizerKeys[eventId] || null;
    setActiveOrganizerKey((prev) => (prev !== stored ? stored : prev));
  }, [currentEvent?.id, storedOrganizerKeys, saveOrganizerKey]);

  // Fetch initial events
  const fetchEvents = useCallback(async (targetEventId?: string) => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      const data: JainEventItem[] = await res.json();
      setEvents(data);

      const params = new URLSearchParams(window.location.search);
      const requestedId = targetEventId || params.get('event');

      if (requestedId) {
        const found = data.find((e) => e.id === requestedId);
        setCurrentEvent(found || null);
      } else {
        // When no specific event link is visited, stay on clean Home Page
        setCurrentEvent(null);
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const paramId = params.get('event');
      if (paramId) {
        const selected = events.find((e) => e.id === paramId);
        setCurrentEvent(selected || null);
      } else {
        setCurrentEvent(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [events]);

  // Handle selecting an event (opens specific event page)
  const handleSelectEvent = (eventId: string) => {
    const selected = events.find((e) => e.id === eventId);
    if (selected) {
      setCurrentEvent(selected);
      const url = new URL(window.location.href);
      url.searchParams.set('event', eventId);
      const storedKey = storedOrganizerKeys[eventId];
      if (storedKey) {
        url.searchParams.set('key', storedKey);
      } else {
        url.searchParams.delete('key');
      }
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Return to clean home page
  const handleBackToHome = () => {
    setCurrentEvent(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('event');
    url.searchParams.delete('key');
    window.history.pushState({}, '', url.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time Server-Sent Events (SSE) Stream for active event
  useEffect(() => {
    if (!currentEvent?.id) {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    if (sseRef.current) {
      sseRef.current.close();
    }

    const sseUrl = `/api/events/${currentEvent.id}/stream`;
    const eventSource = new EventSource(sseUrl);
    sseRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === 'EVENT_SNAPSHOT' || payload.type === 'EVENT_UPDATED') {
          setCurrentEvent(payload.event);
          setEvents((prev) =>
            prev.map((item) => (item.id === payload.event.id ? payload.event : item))
          );
        } else if (payload.type === 'EVENT_DELETED') {
          showToast('This event was cancelled by the organizer.');
          handleBackToHome();
          fetchEvents();
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [currentEvent?.id, fetchEvents]);

  // Is Organizer: verified if activeOrganizerKey is present
  const isOrganizer = !!activeOrganizerKey;

  // Guest Join Action -> Positive Blessing Popup!
  const handleJoin = async (profileData: {
    name: string;
    phone: string;
    hallOfResidence: string;
    guestId: string;
    notes?: string;
  }) => {
    if (!currentEvent) return;

    const res = await fetch(`/api/events/${currentEvent.id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to join event');
    }

    const result = await res.json();
    setCurrentEvent(result.event);
    setBlessingGuest(result.guest);
    setShowBlessingModal(true);
    showToast(`🙏 Jai Jinendra! Your presence is confirmed, ${profileData.name}`);
  };

  // Guest Cancel Presence Action
  const handleLeave = async (guestId: string) => {
    if (!currentEvent) return;

    const res = await fetch(`/api/events/${currentEvent.id}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to cancel presence');
    }

    const result = await res.json();
    setCurrentEvent(result.event);
    showToast('Your presence has been cancelled. Micchami Dukkadam.');
  };

  // Organizer: Create new event
  const handleCreateEvent = async (eventData: any) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create event');
    }

    const created = await res.json();
    setEvents((prev) => [created.event, ...prev]);
    saveOrganizerKey(created.event.id, created.organizerKey);
    setCurrentEvent(created.event);

    const url = new URL(window.location.href);
    url.searchParams.set('event', created.event.id);
    url.searchParams.set('key', created.organizerKey);
    window.history.pushState({}, '', url.toString());

    setShareTargetEvent(created.event);
    setShowShareModal(true);
    showToast('Event created successfully! Organizer key saved to your browser.');
    return { eventId: created.event.id, organizerKey: created.organizerKey };
  };

  // Organizer: Update event details
  const handleUpdateEvent = async (updatedData: Partial<JainEventItem>) => {
    if (!currentEvent || !activeOrganizerKey) return;

    const res = await fetch(`/api/events/${currentEvent.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-organizer-key': activeOrganizerKey,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update event');
    }

    const updated = await res.json();
    setCurrentEvent(updated.event);
    showToast('Event details updated live.');
  };

  // Organizer: Cancel/Delete event
  const handleCancelEvent = async () => {
    if (!currentEvent || !activeOrganizerKey) return;

    const res = await fetch(`/api/events/${currentEvent.id}`, {
      method: 'DELETE',
      headers: {
        'x-organizer-key': activeOrganizerKey,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to cancel event');
    }

    showToast('Event cancelled and removed.');
    handleBackToHome();
    fetchEvents();
  };

  // Organizer: Remove guest
  const handleRemoveGuestByOrganizer = async (guestId: string) => {
    if (!currentEvent || !activeOrganizerKey) return;

    const res = await fetch(`/api/events/${currentEvent.id}/guests/${guestId}`, {
      method: 'DELETE',
      headers: {
        'x-organizer-key': activeOrganizerKey,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to remove guest');
    }

    const updated = await res.json();
    setCurrentEvent(updated.event);
    showToast('Guest attendance removed by organizer.');
  };

  // Organizer Auth: Unlock with passkey
  const handleUnlockWithKey = async (key: string): Promise<boolean> => {
    if (!currentEvent) return false;

    const res = await fetch(`/api/events/${currentEvent.id}/verify-organizer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      saveOrganizerKey(currentEvent.id, key);
      const url = new URL(window.location.href);
      url.searchParams.set('key', key);
      window.history.pushState({}, '', url.toString());
      showToast('Organizer mode unlocked! You can now edit event timings & guests.');
      return true;
    }
    return false;
  };

  // Organizer Auth: Google sign-in
  const handleGoogleSignIn = async (email: string): Promise<boolean> => {
    if (!currentEvent) return false;

    const res = await fetch(`/api/events/${currentEvent.id}/google-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.organizerKey) {
        saveOrganizerKey(currentEvent.id, data.organizerKey);
        const url = new URL(window.location.href);
        url.searchParams.set('key', data.organizerKey);
        window.history.pushState({}, '', url.toString());
        showToast(`Signed in with Google as Organizer (${email})`);
        return true;
      }
    }
    return false;
  };

  const handleLeaveOrganizerMode = () => {
    if (!currentEvent) return;
    setActiveOrganizerKey(null);
    setStoredOrganizerKeys((prev) => {
      const copy = { ...prev };
      delete copy[currentEvent.id];
      try {
        localStorage.setItem(ORGANIZER_KEYS_STORAGE_KEY, JSON.stringify(copy));
      } catch (e) {
        console.error(e);
      }
      return copy;
    });

    const url = new URL(window.location.href);
    url.searchParams.delete('key');
    window.history.pushState({}, '', url.toString());

    showToast('Exited Organizer Mode. Now viewing in Devotee Mode.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm text-center max-w-sm w-full border border-amber-200 dark:border-neutral-800">
          <Loader2 className="w-9 h-9 text-amber-600 dark:text-amber-400 animate-spin mx-auto mb-3" />
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">Loading Sangha Events...</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Connecting to live darshan & event updates</p>
        </div>
      </div>
    );
  }

  // If no event is selected (or cleared), render the clean Home Page
  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-stone-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-neutral-800 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <HomePage
          events={events}
          userProfile={userProfile}
          onSelectEvent={handleSelectEvent}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onShareEvent={(evt) => {
            setShareTargetEvent(evt);
            setShowShareModal(true);
          }}
        />

        {/* Create Event Modal */}
        {showCreateModal && (
          <CreateEventModal
            userProfile={userProfile}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateEvent}
          />
        )}

        {/* Share Modal from Home */}
        {showShareModal && shareTargetEvent && (
          <ShareModal
            event={shareTargetEvent}
            organizerKey={storedOrganizerKeys[shareTargetEvent.id]}
            onClose={() => {
              setShowShareModal(false);
              setShareTargetEvent(null);
            }}
            onOpenQR={() => {
              setQrTargetEvent(shareTargetEvent);
              setShowQRModal(true);
            }}
          />
        )}

        {/* QR Modal from Home */}
        {showQRModal && qrTargetEvent && (
          <QRCodeModal
            event={qrTargetEvent}
            onClose={() => {
              setShowQRModal(false);
              setQrTargetEvent(null);
            }}
          />
        )}
      </div>
    );
  }

  // Active Specific Event View
  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-neutral-800 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Event Header */}
      <EventHeader
        event={currentEvent}
        isConnected={isConnected}
        isOrganizer={isOrganizer}
        onBackToHome={handleBackToHome}
        onOpenShareModal={() => {
          setShareTargetEvent(currentEvent);
          setShowShareModal(true);
        }}
        onOpenQRModal={() => {
          setQrTargetEvent(currentEvent);
          setShowQRModal(true);
        }}
        onOpenCreateModal={() => setShowCreateModal(true)}
        onBrowseEvents={() => setShowBrowserModal(true)}
        onOpenEditEvent={() => setShowEditModal(true)}
        onOpenOrganizerAuth={() => setShowAuthModal(true)}
        onLeaveOrganizerMode={handleLeaveOrganizerMode}
      />

      {/* Main Container for Selected Event */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Devotee Join Card (With 1-Click Join and Cancel Attendance) */}
        <GuestJoinCard
          event={currentEvent}
          userProfile={userProfile}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onUpdateProfile={handleUpdateProfile}
          onViewBlessing={() => {
            const currentGuest = currentEvent.guests.find(
              (g) => userProfile?.guestId && g.id === userProfile.guestId
            );
            if (currentGuest) {
              setBlessingGuest(currentGuest);
              setShowBlessingModal(true);
            }
          }}
        />

        {/* View Switcher Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 bg-amber-100/70 dark:bg-neutral-800 p-1 rounded-2xl text-xs font-semibold border border-amber-200/60 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setViewTab('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                viewTab === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-amber-900 dark:text-neutral-300 hover:text-black dark:hover:text-white'
              }`}
            >
              Overview (Details & Devotees)
            </button>
            <button
              type="button"
              onClick={() => setViewTab('guests')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewTab === 'guests'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-amber-900 dark:text-neutral-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Devotees ({currentEvent.guests.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewTab === 'guide'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-amber-900 dark:text-neutral-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Temple Guide & Teachings</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Event ID: <strong>{currentEvent.id}</strong></span>
          </div>
        </div>

        {/* Content Layout */}
        {viewTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Temple Guide & Spiritual Details */}
            <div className="lg:col-span-7 space-y-6">
              <TempleGuideCard event={currentEvent} />
            </div>

            {/* Right 5 Cols: Devotees Guest List */}
            <div className="lg:col-span-5 space-y-6">
              <GuestList
                event={currentEvent}
                currentGuestId={userProfile?.guestId}
                isOrganizer={isOrganizer}
                onRemoveGuestByOrganizer={handleRemoveGuestByOrganizer}
                onCancelMyAttendance={handleLeave}
              />
            </div>
          </div>
        )}

        {viewTab === 'guests' && (
          <div className="max-w-3xl mx-auto">
            <GuestList
              event={currentEvent}
              currentGuestId={userProfile?.guestId}
              isOrganizer={isOrganizer}
              onRemoveGuestByOrganizer={handleRemoveGuestByOrganizer}
              onCancelMyAttendance={handleLeave}
            />
          </div>
        )}

        {viewTab === 'guide' && (
          <div className="max-w-3xl mx-auto">
            <TempleGuideCard event={currentEvent} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="font-serif font-medium">🙏 Jain Sangha & Temple Darshan</span>
            </p>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
            <a
              id="footer-instagram-app"
              href="https://www.instagram.com/jainsamaj_iitkgp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Jain Samaj IIT Kharagpur (@jainsamaj_iitkgp)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300 font-medium">
            <button
              onClick={() => {
                setShareTargetEvent(currentEvent);
                setShowShareModal(true);
              }}
              className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
            >
              Share Invitation
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQrTargetEvent(currentEvent);
                setShowQRModal(true);
              }}
              className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
            >
              Temple QR
            </button>
            <span>•</span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
            >
              Post Event
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showBlessingModal && blessingGuest && (
        <PositiveBlessingModal
          event={currentEvent}
          guest={blessingGuest}
          onClose={() => setShowBlessingModal(false)}
          onShareWhatsApp={() => {
            setShowBlessingModal(false);
            setShareTargetEvent(currentEvent);
            setShowShareModal(true);
          }}
        />
      )}

      {showEditModal && activeOrganizerKey && (
        <EditEventModal
          event={currentEvent}
          organizerKey={activeOrganizerKey}
          onClose={() => setShowEditModal(false)}
          onUpdateEvent={handleUpdateEvent}
          onCancelEvent={handleCancelEvent}
        />
      )}

      {showAuthModal && (
        <OrganizerAuthModal
          event={currentEvent}
          onClose={() => setShowAuthModal(false)}
          onUnlockWithKey={handleUnlockWithKey}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          userProfile={userProfile}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {showShareModal && (shareTargetEvent || currentEvent) && (
        <ShareModal
          event={shareTargetEvent || currentEvent}
          organizerKey={activeOrganizerKey || storedOrganizerKeys[(shareTargetEvent || currentEvent).id]}
          onClose={() => {
            setShowShareModal(false);
            setShareTargetEvent(null);
          }}
          onOpenQR={() => {
            setQrTargetEvent(shareTargetEvent || currentEvent);
            setShowQRModal(true);
          }}
        />
      )}

      {showQRModal && (qrTargetEvent || currentEvent) && (
        <QRCodeModal
          event={qrTargetEvent || currentEvent}
          onClose={() => {
            setShowQRModal(false);
            setQrTargetEvent(null);
          }}
        />
      )}

      {showBrowserModal && (
        <EventsBrowserModal
          events={events}
          currentEventId={currentEvent.id}
          userProfile={userProfile}
          onSelectEvent={handleSelectEvent}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onClose={() => setShowBrowserModal(false)}
        />
      )}
    </div>
  );
}
