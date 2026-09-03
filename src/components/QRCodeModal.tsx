import React from 'react';
import { JainEventItem } from '../types';
import { X, QrCode, Download } from 'lucide-react';

interface QRCodeModalProps {
  event: JainEventItem;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ event, onClose }) => {
  const publicUrl = `${window.location.origin}${window.location.pathname}?event=${event.id}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    publicUrl
  )}&color=78350f&bgcolor=fffbeb`;

  return (
    <div
      id="qr-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="qr-modal-card"
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-neutral-800 overflow-hidden text-center text-neutral-900 dark:text-neutral-100 transition-colors"
      >
        <div className="flex items-center justify-between p-4 border-b border-amber-100 dark:border-neutral-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-neutral-850 dark:to-neutral-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Scan to Join Gathering</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-1">
              {event.title}
            </h4>
            <p className="text-2xs text-amber-800 dark:text-amber-300 font-medium">
              {event.templeName}
            </p>
          </div>

          <div className="inline-block p-4 bg-amber-50/90 dark:bg-neutral-800 rounded-2xl border border-amber-200 dark:border-neutral-700 shadow-inner">
            <img
              src={qrApiUrl}
              alt="Scan to join Sangha event"
              referrerPolicy="no-referrer"
              className="w-48 h-48 rounded-xl object-contain mx-auto bg-amber-50 p-2"
            />
          </div>

          <p className="text-2xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            Scan with your phone camera to view event details and join instantly.
          </p>

          <div className="flex gap-2 pt-2">
            <a
              href={qrApiUrl}
              download={`${event.title.replace(/\s+/g, '_')}_QR.png`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold text-xs rounded-xl border border-amber-300 dark:border-amber-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save QR Image</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
