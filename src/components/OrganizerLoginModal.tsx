import React, { useState } from 'react';
import { ShieldCheck, Mail, User, Key, X, Lock, CheckCircle2 } from 'lucide-react';
import { OrganizerAccount } from '../types';

interface OrganizerLoginModalProps {
  onClose: () => void;
  onSuccess: (organizer: OrganizerAccount) => void;
}

export const OrganizerLoginModal: React.FC<OrganizerLoginModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/organizer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          passcode: passcode.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to authenticate organizer');
      }

      onSuccess(data.organizer);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="organizer-login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="organizer-login-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-100 dark:border-neutral-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-neutral-850 dark:to-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Organizer Login
              </h3>
              <p className="text-2xs text-neutral-600 dark:text-neutral-400">
                Authorized access for posting & managing Sangha activities
              </p>
            </div>
          </div>
          <button
            id="btn-close-organizer-login"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/60 border border-amber-200/70 dark:border-neutral-700 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Organizer Privilege Mode</span>
            </div>
            <p className="text-2xs text-neutral-600 dark:text-neutral-300">
              Only verified organizers can create and publish new religious events. For guests, the event creation option remains hidden to maintain authentic Sangha announcements.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="organizer-login-email" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Organizer Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                id="organizer-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sanskar@iitkgp.ac.in or gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <p className="text-2xs text-neutral-500 dark:text-neutral-400">
              Your email will be associated with the events you organize.
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="organizer-login-name" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Organizer Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                id="organizer-login-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanskar Sovitkar"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Optional Coordinator Passcode */}
          <div className="space-y-1.5">
            <label htmlFor="organizer-login-passcode" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
              <span>Coordinator Passcode</span>
              <span className="text-2xs font-normal text-neutral-500 dark:text-neutral-400">Optional</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                id="organizer-login-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Optional sangha pin / secret"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-submit-organizer-login"
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Organizer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
