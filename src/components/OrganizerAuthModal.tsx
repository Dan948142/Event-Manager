import React, { useState } from 'react';
import { JainEventItem } from '../types';
import { ShieldCheck, Key, CheckCircle2, Lock, X } from 'lucide-react';

interface OrganizerAuthModalProps {
  event: JainEventItem;
  onClose: () => void;
  onUnlockWithKey: (key: string) => Promise<boolean>;
  onGoogleSignIn: (email: string) => Promise<boolean>;
}

export const OrganizerAuthModal: React.FC<OrganizerAuthModalProps> = ({
  event,
  onClose,
  onUnlockWithKey,
  onGoogleSignIn,
}) => {
  const [organizerKey, setOrganizerKey] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'passkey' | 'google'>('passkey');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const ok = await onUnlockWithKey(organizerKey.trim());
      if (ok) {
        onClose();
      } else {
        setError('Invalid Organizer Passkey. Please verify your secret key.');
      }
    } catch {
      setError('Verification failed. Please check your key.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const ok = await onGoogleSignIn(googleEmail.trim());
      if (ok) {
        onClose();
      } else {
        setError('Google account not recognized as organizer for this event.');
      }
    } catch {
      setError('Sign-in verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="organizer-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="organizer-auth-card"
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800 bg-amber-50/60 dark:bg-neutral-850">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Organizer Access</h3>
              <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                Unlock editing rights & attendee management
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
          {/* Information box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/70 border border-amber-200/70 dark:border-neutral-700 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Organizer Privileges:</span>
            </p>
            <ul className="text-2xs space-y-0.5 text-neutral-600 dark:text-neutral-300 pl-4 list-disc">
              <li>Edit event timings, temple venue, and guidelines</li>
              <li>Remove duplicate or canceled attendees</li>
              <li>Cancel or delete the event</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Tab buttons */}
          <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('passkey')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'passkey'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Organizer Passkey
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('google')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'google'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Google / Email Account
            </button>
          </div>

          {activeTab === 'passkey' ? (
            <form onSubmit={handleKeySubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="auth-passkey-input" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Organizer Secret Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    id="auth-passkey-input"
                    type="password"
                    required
                    placeholder="e.g. org-123456..."
                    value={organizerKey}
                    onChange={(e) => setOrganizerKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                  This was generated when this event was created by {event.organizerName}.
                </p>
              </div>

              <button
                id="btn-submit-organizer-key"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Unlock Organizer Mode'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="auth-google-email" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Sign in with Google Account
                </label>
                <input
                  id="auth-google-email"
                  type="email"
                  required
                  placeholder="organizer@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
                <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                  Authenticate your account to manage all events posted under your Google account.
                </p>
              </div>

              <button
                id="btn-google-sign-in"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{loading ? 'Connecting...' : 'Sign in as Organizer'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
