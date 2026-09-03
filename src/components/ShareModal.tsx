import React, { useState } from 'react';
import { JainEventItem } from '../types';
import { Share2, Copy, Check, QrCode, X, Instagram, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  event: JainEventItem;
  organizerKey?: string | null;
  onClose: () => void;
  onOpenQR: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  event,
  organizerKey,
  onClose,
  onOpenQR,
}) => {
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedOrganizer, setCopiedOrganizer] = useState(false);

  const publicUrl = `${window.location.origin}${window.location.pathname}?event=${event.id}`;
  const organizerUrl = organizerKey
    ? `${window.location.origin}${window.location.pathname}?event=${event.id}&key=${organizerKey}`
    : null;

  const eventDate = new Date(event.dateTime).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const whatsappMessage = `🙏 *Jai Jinendra!*\n\nYou are cordially invited to join our sacred Sangha event:\n\n🕉️ *${event.title}*\n📍 *Temple:* ${event.templeName}\n⏰ *Date & Time:* ${eventDate}\n📌 *Location:* ${event.location}\n\n✨ *View Details & Devotee List:* ${publicUrl}\n\n🌸 *Follow Jain Samaj IIT Kharagpur:* https://www.instagram.com/jainsamaj_iitkgp/\n\n_Ahimsa Paramo Dharma • Live and let live._`;

  const handleCopyPublic = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyOrganizer = async () => {
    if (!organizerUrl) return;
    try {
      await navigator.clipboard.writeText(organizerUrl);
      setCopiedOrganizer(true);
      setTimeout(() => setCopiedOrganizer(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="share-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors"
      >
        <div className="flex items-center justify-between p-5 border-b border-amber-100 dark:border-neutral-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-neutral-850 dark:to-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Share Sangha Invitation
              </h2>
              <p className="text-2xs sm:text-xs text-neutral-600 dark:text-neutral-400">
                Invite devotees, family, and campus mandal to join
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

        <div className="p-5 sm:p-6 space-y-4">
          {/* WhatsApp Direct Button */}
          <button
            id="btn-whatsapp-direct"
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via WhatsApp to Sangha Groups</span>
          </button>

          {/* Public Invitation Link */}
          <div className="space-y-1.5">
            <label htmlFor="share-public-link" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Devotee Public Link (View & Join)
            </label>
            <div className="flex gap-2">
              <input
                id="share-public-link"
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-200 focus:outline-hidden"
              />
              <button
                id="btn-copy-public-link"
                type="button"
                onClick={handleCopyPublic}
                className="px-4 py-2 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold text-xs rounded-xl border border-amber-300 dark:border-amber-800 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedPublic ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Organizer Link (If available) */}
          {organizerUrl && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-neutral-800/80 border border-amber-200/90 dark:border-neutral-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  Secret Organizer Admin Link
                </span>
                <span className="text-2xs text-rose-700 dark:text-rose-400 font-medium">Keep private</span>
              </div>
              <p className="text-2xs text-neutral-600 dark:text-neutral-400">
                Anyone opening this link has organizer privileges (edit event, change timings, remove guests).
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={organizerUrl}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-amber-300 dark:border-neutral-600 rounded-lg text-2xs text-neutral-700 dark:text-neutral-200 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleCopyOrganizer}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-2xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  {copiedOrganizer ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOrganizer ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* QR Code Option */}
          <div className="pt-2 space-y-2.5">
            <button
              id="btn-open-qr-from-share"
              type="button"
              onClick={() => {
                onClose();
                onOpenQR();
              }}
              className="w-full py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span>Show Printable QR Code (For Temple / Hostel Noticeboard)</span>
            </button>

            {/* Community Instagram Follow Link */}
            <a
              id="share-modal-instagram-link"
              href="https://www.instagram.com/jainsamaj_iitkgp/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-2.5 rounded-xl bg-linear-to-r from-rose-50 to-amber-50 dark:from-neutral-850 dark:to-neutral-800 border border-rose-200/80 dark:border-neutral-700 flex items-center justify-between gap-2 text-xs hover:border-rose-300 transition-all group"
            >
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Jain Samaj IIT Kharagpur
                </span>
                <span className="text-2xs text-neutral-500 dark:text-neutral-400">@jainsamaj_iitkgp</span>
              </div>
              <span className="text-2xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1 group-hover:underline">
                Follow <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
