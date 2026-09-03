import React, { useState, useEffect } from 'react';
import { JainEventItem, UserLocalProfile } from '../types';
import { IIT_KGP_HALLS } from '../data/jainQuotes';
import {
  UserCheck,
  UserPlus,
  Building2,
  Phone,
  User,
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface GuestJoinCardProps {
  event: JainEventItem;
  userProfile: UserLocalProfile | null;
  onJoin: (profile: {
    name: string;
    phone: string;
    hallOfResidence: string;
    guestId: string;
    notes?: string;
  }) => Promise<void>;
  onLeave: (guestId: string) => Promise<void>;
  onUpdateProfile: (profile: UserLocalProfile) => void;
  onViewBlessing: () => void;
}

const POPULAR_QUICK_HALLS = [
  'Lal Bahadur Shastri (LBS) Hall',
  'Azad Hall',
  'Radhakrishnan (RK) Hall',
  'Sarojini Naidu / Indira Gandhi (SN/IG) Hall',
  'Patel Hall',
  'Nehru Hall',
  'Rani Laxmibai (RLB) Hall',
  'Meghnad Saha (MS) Hall',
];

export const GuestJoinCard: React.FC<GuestJoinCardProps> = ({
  event,
  userProfile,
  onJoin,
  onLeave,
  onUpdateProfile,
  onViewBlessing,
}) => {
  // Check if current device user is already in the guest list (by guestId, or by matching saved name/phone)
  const currentGuest = event.guests.find(
    (g) =>
      (userProfile?.guestId && g.id === userProfile.guestId) ||
      (userProfile?.name &&
        g.name.trim().toLowerCase() === userProfile.name.trim().toLowerCase() &&
        (!userProfile.phone || !g.phone || g.phone.trim() === userProfile.phone.trim()))
  );
  const isJoined = !!currentGuest;

  const [isEditingForm, setIsEditingForm] = useState(!userProfile);
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [hallOfResidence, setHallOfResidence] = useState(
    userProfile?.hallOfResidence || IIT_KGP_HALLS[7] // LBS Hall as friendly default
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Automatically pre-fill saved devotee data when switching events
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setPhone(userProfile.phone || '');
      setHallOfResidence(userProfile.hallOfResidence || IIT_KGP_HALLS[7]);
      setIsEditingForm(!userProfile.name);
    }
  }, [event.id, userProfile?.name, userProfile?.phone, userProfile?.hallOfResidence]);

  const handleQuickJoin = async () => {
    if (!userProfile) return;
    const cleanSavedPhone = (userProfile.phone || '').trim().replace(/[\s-]/g, '');
    if (!cleanSavedPhone || cleanSavedPhone.length < 10) {
      setIsEditingForm(true);
      setFormError('WhatsApp / Mobile Number is mandatory. Please provide your 10-digit number to join.');
      return;
    }

    setLoading(true);
    setFormError(null);
    try {
      await onJoin({
        guestId: userProfile.guestId,
        name: userProfile.name,
        phone: userProfile.phone,
        hallOfResidence: userProfile.hallOfResidence,
      });
      onViewBlessing();
    } catch (err: any) {
      setFormError(err.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      setFormError('WhatsApp / Mobile Number is mandatory for Sangha coordination.');
      return;
    }
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!hallOfResidence.trim()) {
      setFormError('Please select your IIT Kharagpur Hall of Residence.');
      return;
    }

    setLoading(true);
    setFormError(null);

    const guestId = userProfile?.guestId || `guest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updatedProfile: UserLocalProfile = {
      guestId,
      name: name.trim(),
      phone: phone.trim(),
      hallOfResidence: hallOfResidence.trim(),
    };

    try {
      await onJoin({
        ...updatedProfile,
        notes: notes.trim() || undefined,
      });
      onUpdateProfile(updatedProfile);
      setIsEditingForm(false);
      onViewBlessing();
    } catch (err: any) {
      setFormError(err.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancelPresence = async () => {
    if (!currentGuest) return;
    setLoading(true);
    try {
      await onLeave(currentGuest.id);
      setConfirmCancelModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to cancel attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="guest-join-card"
      className="bg-white dark:bg-neutral-900 rounded-3xl border border-amber-200/90 dark:border-neutral-800 p-5 sm:p-7 shadow-xs relative overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors"
    >
      {/* Warm Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 via-orange-400 to-amber-500" />

      {/* Confirmation to cancel modal */}
      {confirmCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-center">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Cancel Attendance?</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Are you sure you want to cancel your attendance for this event? You can always join again later.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCancelModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                Keep Attendance
              </button>
              <button
                id="btn-confirm-cancel-presence"
                type="button"
                onClick={handleConfirmCancelPresence}
                disabled={loading}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUEST IS ALREADY ATTENDING */}
      {isJoined ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                    Confirmed Attending
                  </span>
                  <span className="text-2xs bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full font-medium">
                    You are on the list
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {currentGuest?.name}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Hall: <strong className="text-neutral-800 dark:text-neutral-200">{currentGuest?.hallOfResidence}</strong>
                  {currentGuest?.phone && ` • ${currentGuest.phone}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:self-center">
              <button
                id="btn-view-blessing-again"
                type="button"
                onClick={onViewBlessing}
                className="px-3 py-2 bg-white dark:bg-neutral-800 hover:bg-amber-50 dark:hover:bg-neutral-700 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-neutral-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>View Blessing</span>
              </button>

              <button
                id="btn-cancel-presence"
                type="button"
                onClick={() => setConfirmCancelModal(true)}
                className="px-3 py-2 bg-white dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel Attendance
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GUEST HAS NOT YET JOINED */
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                  <HeartHandshake className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Devotee Registration • Open to All
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Join Temple Gathering
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Simple sign-up. Select your IIT Kharagpur hall and enter your name to coordinate with the Sangha.
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Returning User Shortcut: 1-Click Join */}
          {userProfile && !isEditingForm ? (
            <div className="bg-amber-50/80 dark:bg-neutral-800/70 border border-amber-200 dark:border-neutral-700 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-amber-900/80 dark:text-amber-300 font-medium">
                    Welcome back! Quick join with saved details:
                  </p>
                  <p className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>{userProfile.name}</span>
                    <span className="text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                      {userProfile.hallOfResidence}
                    </span>
                  </p>
                  {userProfile.phone && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{userProfile.phone}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-quick-join-one-click"
                    type="button"
                    onClick={handleQuickJoin}
                    disabled={loading}
                    className="px-5 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-102"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{loading ? 'Joining...' : 'Join Now (1-Click)'}</span>
                  </button>

                  <button
                    id="btn-edit-details"
                    type="button"
                    onClick={() => {
                      setName(userProfile.name);
                      setPhone(userProfile.phone);
                      setHallOfResidence(userProfile.hallOfResidence);
                      setIsEditingForm(true);
                    }}
                    className="px-3 py-3 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium underline"
                  >
                    Change Info
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* First Time / Full Join Form */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="guest-name-input" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      id="guest-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Shah"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="guest-phone-input" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      id="guest-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210 (10 digits)"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                  <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                    Mandatory for temple visit conveyance & coordination.
                  </p>
                </div>
              </div>

              {/* Hall of Residence Drop Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="guest-hall-select" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    IIT Kharagpur Hall of Residence <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-2xs text-neutral-500 dark:text-neutral-400">
                    Select your IIT KGP Hall
                  </span>
                </div>

                <div className="relative">
                  <Building2 className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    id="guest-hall-select"
                    required
                    value={hallOfResidence}
                    onChange={(e) => setHallOfResidence(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 appearance-none font-medium cursor-pointer"
                  >
                    <option value="" disabled>-- Select IIT Kharagpur Hall --</option>
                    <optgroup label="Halls of Residence">
                      {IIT_KGP_HALLS.filter((h) => !h.includes('Staff') && !h.includes('Day Scholar')).map((hall) => (
                        <option key={hall} value={hall}>
                          {hall}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Campus & Other">
                      <option value="Campus Staff / Faculty Quarters">Campus Staff / Faculty Quarters</option>
                      <option value="Day Scholar / Off-Campus / Visitor">Day Scholar / Off-Campus / Visitor</option>
                    </optgroup>
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-neutral-400 dark:text-neutral-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Popular Hall Shortcut Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-2xs text-neutral-500 dark:text-neutral-400">Popular:</span>
                  {POPULAR_QUICK_HALLS.map((hall) => {
                    const shortName = hall.split(' (')[0].replace(' Hall', '');
                    return (
                      <button
                        key={hall}
                        type="button"
                        onClick={() => setHallOfResidence(hall)}
                        className={`text-2xs px-2.5 py-1 rounded-lg border transition-all ${
                          hallOfResidence === hall
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700 font-bold shadow-2xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-700'
                        }`}
                        title={hall}
                      >
                        {shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Devotional Note / Help */}
              <div className="space-y-1.5">
                <label htmlFor="guest-notes-input" className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Note / Seva Offering (Optional)
                </label>
                <input
                  id="guest-notes-input"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Can bring puja materials, need cycle buddy from hall..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    id="btn-submit-join"
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-102"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loading ? 'Confirming...' : 'Confirm & Join'}</span>
                  </button>

                  {userProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingForm(false)}
                      className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="text-2xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {userProfile
                      ? 'Auto-fetched from device memory. Updates will save for next events.'
                      : 'Saved on your device — next events will auto-fetch your details.'}
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
