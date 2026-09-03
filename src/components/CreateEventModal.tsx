import React, { useState } from 'react';
import { JainEventType, UserLocalProfile } from '../types';
import { JAIN_EVENT_TYPES, DEFAULT_TEMPLE_GUIDELINES } from '../data/jainQuotes';
import { X, Calendar, MapPin, Building, Sparkles, User, Phone, Mail } from 'lucide-react';

interface CreateEventModalProps {
  userProfile: UserLocalProfile | null;
  onClose: () => void;
  onCreate: (eventData: any) => Promise<{ eventId: string; organizerKey: string }>;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  userProfile,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<JainEventType>('Temple Darshan');
  const [templeName, setTempleName] = useState('');
  const [location, setLocation] = useState('');
  // Default to tomorrow 7:00 AM
  const tomorrow = new Date(Date.now() + 86400000);
  const defaultDateTime = `${tomorrow.toISOString().slice(0, 10)}T07:00`;
  const [dateTime, setDateTime] = useState(defaultDateTime);
  const [description, setDescription] = useState('');
  const [guidelines, setGuidelines] = useState(DEFAULT_TEMPLE_GUIDELINES);

  const [organizerName, setOrganizerName] = useState(userProfile?.name || '');
  const [organizerPhone, setOrganizerPhone] = useState(userProfile?.phone || '');
  const [organizerEmail, setOrganizerEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick preset suggestions
  const presets = [
    {
      title: 'Sunday Morning Pakshal & Abhishek',
      type: 'Morning Puja & Abhishek' as JainEventType,
      temple: 'Shri Parshvanath Digambar Jain Mandir',
      desc: 'Weekly morning abhishek, shanti dhara, and communal Navkar jaap with the Sangha.',
    },
    {
      title: 'Bhakti Sandhya & 108 Deepam Mangal Aarti',
      type: 'Bhakti Sandhya & Aarti' as JainEventType,
      temple: 'Shri Mahavira Swami Jinalaya & Derasar',
      desc: 'Devotional stavan recitation and evening mangal aarti followed by prabhavna distribution.',
    },
    {
      title: 'Monthly Temple Darshan & Swadhyay',
      type: 'Temple Darshan' as JainEventType,
      temple: 'Dadabari Jain Tirth / Local Jinalaya',
      desc: 'Sangha visit for peace of mind, peaceful darshan, and swadhyay on Tattvartha Sutra.',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setEventType(p.type);
    setTempleName(p.temple);
    setDescription(p.desc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !templeName.trim() || !organizerName.trim()) {
      setError('Title, Temple Name, and Organizer Name are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onCreate({
        title,
        eventType,
        templeName,
        location,
        dateTime,
        description,
        guidelines,
        organizerName,
        organizerPhone,
        organizerEmail,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="create-event-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="create-event-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 max-h-[90vh] flex flex-col transition-colors"
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-amber-100 dark:border-neutral-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-neutral-850 dark:to-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Post New Jain Religious Activity
              </h2>
              <p className="text-2xs sm:text-xs text-neutral-600 dark:text-neutral-400">
                Create an event for Temple Darshan, Puja, Bhakti, or Yatra
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-2xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Quick Event Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-2xs px-2.5 py-1.5 bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-neutral-700 rounded-xl transition-colors font-medium text-left"
                >
                  + {p.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="create-title" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="create-title"
                type="text"
                required
                placeholder="e.g. Sunday Temple Darshan & Pakshal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label htmlFor="create-type" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Activity Type
              </label>
              <select
                id="create-type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as JainEventType)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                {JAIN_EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
              <label htmlFor="create-datetime" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Date & Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-3" />
                <input
                  id="create-datetime"
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Temple Name */}
            <div className="space-y-1">
              <label htmlFor="create-temple" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Temple / Derasar Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-3" />
                <input
                  id="create-temple"
                  type="text"
                  required
                  placeholder="e.g. Shri Parshvanath Jain Mandir"
                  value={templeName}
                  onChange={(e) => setTempleName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Location / Address */}
            <div className="space-y-1">
              <label htmlFor="create-location" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Address / Pickup Point
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-3" />
                <input
                  id="create-location"
                  type="text"
                  placeholder="e.g. Near University Main Gate"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="create-description" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Description & Schedule (Optional)
            </label>
            <textarea
              id="create-description"
              rows={2}
              placeholder="Provide event details, carpool info, or puja program..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Guidelines */}
          <div className="space-y-1">
            <label htmlFor="create-guidelines" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Temple Darshan Guidelines (Dress code, purity, etiquette)
            </label>
            <textarea
              id="create-guidelines"
              rows={3}
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Organizer Credentials Section */}
          <div className="p-4 bg-amber-50/70 dark:bg-neutral-800/70 rounded-2xl border border-amber-200/80 dark:border-neutral-700 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Organizer Details (You will receive an Organizer Management Passkey)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-org-name" className="block text-2xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Organizer Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    id="create-org-name"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="create-org-phone" className="block text-2xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Organizer Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    id="create-org-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="create-org-email" className="block text-2xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Email / Google Account (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    id="create-org-email"
                    type="email"
                    placeholder="organizer@gmail.com"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Cancel
            </button>

            <button
              id="btn-publish-event"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Publishing Event...' : 'Publish Event & Get Link'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
