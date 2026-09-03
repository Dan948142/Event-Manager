import React, { useState } from 'react';
import { JainEventItem, JainEventType } from '../types';
import { JAIN_EVENT_TYPES } from '../data/jainQuotes';
import { X, Calendar, MapPin, Building, Phone, Edit3 } from 'lucide-react';

interface EditEventModalProps {
  event: JainEventItem;
  organizerKey: string;
  onClose: () => void;
  onUpdateEvent: (updatedData: Partial<JainEventItem>) => Promise<void>;
  onCancelEvent: () => Promise<void>;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  onClose,
  onUpdateEvent,
  onCancelEvent,
}) => {
  const [title, setTitle] = useState(event.title);
  const [eventType, setEventType] = useState<JainEventType>(event.eventType);
  const [templeName, setTempleName] = useState(event.templeName);
  const [location, setLocation] = useState(event.location);
  const [dateTime, setDateTime] = useState(event.dateTime);
  const [description, setDescription] = useState(event.description);
  const [guidelines, setGuidelines] = useState(event.guidelines);
  const [organizerPhone, setOrganizerPhone] = useState(event.organizerPhone);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !templeName.trim() || !dateTime) {
      setError('Title, Temple Name, and Date/Time are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onUpdateEvent({
        title,
        eventType,
        templeName,
        location,
        dateTime,
        description,
        guidelines,
        organizerPhone,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEventClick = async () => {
    if (
      window.confirm(
        'Are you sure you want to permanently cancel and delete this event? All attendees will be notified.'
      )
    ) {
      setLoading(true);
      try {
        await onCancelEvent();
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to cancel event');
        setLoading(false);
      }
    }
  };

  return (
    <div
      id="edit-event-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="edit-event-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 max-h-[90vh] flex flex-col transition-colors"
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 bg-amber-50/60 dark:bg-neutral-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Edit Event & Timings (Organizer)
              </h2>
              <p className="text-2xs sm:text-xs text-neutral-500 dark:text-neutral-400">
                Changes will sync live to all devotees connected to this event.
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

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Title */}
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="edit-title" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label htmlFor="edit-type" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Religious Activity Type
              </label>
              <select
                id="edit-type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as JainEventType)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
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
              <label htmlFor="edit-datetime" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Date & Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                <input
                  id="edit-datetime"
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Temple Name */}
            <div className="space-y-1">
              <label htmlFor="edit-temple" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Temple / Derasar Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                <input
                  id="edit-temple"
                  type="text"
                  required
                  value={templeName}
                  onChange={(e) => setTempleName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Location / Landmark */}
            <div className="space-y-1">
              <label htmlFor="edit-location" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Location / Pickup Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                <input
                  id="edit-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Organizer Phone */}
            <div className="space-y-1">
              <label htmlFor="edit-phone" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Organizer Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                <input
                  id="edit-phone"
                  type="tel"
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="edit-desc" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Description & Schedule
            </label>
            <textarea
              id="edit-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Guidelines */}
          <div className="space-y-1">
            <label htmlFor="edit-guidelines" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Temple Darshan Guidelines (Vastra, Purity, Etiquette)
            </label>
            <textarea
              id="edit-guidelines"
              rows={3}
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="btn-delete-event-danger"
              type="button"
              onClick={handleCancelEventClick}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              Cancel & Delete Event
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Close
              </button>
              <button
                id="btn-save-event-changes"
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
