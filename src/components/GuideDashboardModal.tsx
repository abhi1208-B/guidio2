import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  DollarSign,
  Star,
  Users,
  MessageSquare,
  Check,
  Loader2,
  Save,
} from 'lucide-react';
import { Guide, BookingRequest } from '../types';
import { GuidePhotoUploader } from './GuidePhotoUploader';
import { uploadGuidePhoto, generateDefaultGuideAvatar } from '../utils/photoStorage';

interface GuideDashboardModalProps {
  guide: Guide;
  bookings: BookingRequest[];
  messages: { id: string; guideId: string; name: string; phone: string; note: string; time: string }[];
  onClose: () => void;
  onEditProfile: () => void;
  onSaveProfile?: (updatedGuide: Guide) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'Confirmed' | 'Declined' | 'Completed') => void;
}

export const GuideDashboardModal: React.FC<GuideDashboardModalProps> = ({
  guide,
  bookings,
  messages,
  onClose,
  onEditProfile,
  onSaveProfile,
  onUpdateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'profile' | 'edit'>('bookings');

  // Edit profile state
  const [editName, setEditName] = useState(guide.name);
  const [editPhoto, setEditPhoto] = useState(guide.photo);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [editPhone, setEditPhone] = useState(guide.phone);
  const [editWhatsapp, setEditWhatsapp] = useState(guide.whatsapp || '');
  const [editBio, setEditBio] = useState(guide.bio);
  const [editHourlyRate, setEditHourlyRate] = useState(guide.hourlyRate);
  const [editDailyRate, setEditDailyRate] = useState(guide.dailyRate);
  const [editAvailability, setEditAvailability] = useState(guide.availability);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState(false);

  const guideBookings = bookings.filter((b) => b.guideId === guide.id);
  const guideMessages = messages.filter((m) => m.guideId === guide.id);

  const headerAvatar = guide.photo || generateDefaultGuideAvatar(guide.name);

  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim() || !editBio.trim() || isSavingProfile) return;

    setIsSavingProfile(true);
    try {
      let finalPhoto = editPhoto;

      if (selectedPhotoFile) {
        finalPhoto = await uploadGuidePhoto(selectedPhotoFile, guide.id);
      } else if (editPhoto && editPhoto.startsWith('data:image/')) {
        finalPhoto = await uploadGuidePhoto(editPhoto, guide.id);
      }

      if (!finalPhoto) {
        finalPhoto = generateDefaultGuideAvatar(editName);
      }

      const updatedGuide: Guide = {
        ...guide,
        name: editName,
        photo: finalPhoto,
        phone: editPhone,
        whatsapp: editWhatsapp.trim() || editPhone.replace(/\D/g, ''),
        bio: editBio,
        hourlyRate: Number(editHourlyRate),
        dailyRate: Number(editDailyRate),
        availability: editAvailability,
      };

      if (onSaveProfile) {
        onSaveProfile(updatedGuide);
      }

      setSavedSuccessNotice(true);
      setTimeout(() => {
        setSavedSuccessNotice(false);
        setActiveTab('profile');
      }, 1500);
    } catch (err) {
      console.error('Error saving guide profile in dashboard:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FBFBF9]">
          <div className="flex items-center gap-3">
            <img
              src={headerAvatar}
              alt={guide.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#1B4332] shadow-xs"
            />
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 leading-tight">
                {guide.name}’s Guide Portal
              </h3>
              <p className="text-xs text-neutral-500">
                {guide.district} · {guide.badgeTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 px-6 bg-neutral-50/50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'bookings'
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tour Requests ({guideBookings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'messages'
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Inquiries & Messages ({guideMessages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'profile'
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'edit'
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile & Photo</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto p-6 space-y-4">
          {/* 1. Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {guideBookings.length === 0 ? (
                <div className="p-10 text-center bg-neutral-50 rounded-xl border border-neutral-200">
                  <Calendar className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-neutral-800">No Booking Requests Yet</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    When travelers request a tour with you on Guido, their dates, party size, and
                    contact numbers will appear here instantly.
                  </p>
                </div>
              ) : (
                guideBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">{b.touristName}</span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : b.status === 'Declined'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : b.status === 'Completed'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#1B4332] font-semibold">
                        {b.destinationName} · {b.duration}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600">
                        <span>Date: <strong>{b.date}</strong></span>
                        <span>·</span>
                        <span>Guests: {b.guestsCount}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-neutral-800">
                          <Phone className="w-3 h-3 text-neutral-500" />
                          <a href={`tel:${b.touristPhone}`} className="underline hover:text-black">
                            {b.touristPhone}
                          </a>
                        </span>
                      </div>

                      {b.specialNotes && (
                        <p className="text-xs text-neutral-500 italic mt-1">
                          "{b.specialNotes}"
                        </p>
                      )}
                    </div>

                    {/* Booking Status Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {b.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onUpdateBookingStatus(b.id, 'Confirmed')}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateBookingStatus(b.id, 'Declined')}
                            className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}

                      {b.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateBookingStatus(b.id, 'Completed')}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              {guideMessages.length === 0 ? (
                <div className="p-10 text-center bg-neutral-50 rounded-xl border border-neutral-200">
                  <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-neutral-800">No Messages Yet</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Direct inquiries and notes submitted by tourists will appear here.
                  </p>
                </div>
              ) : (
                guideMessages.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-sm">{m.name}</span>
                      <span className="text-[11px] text-neutral-400">{m.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <a href={`tel:${m.phone}`} className="underline font-medium">
                        {m.phone}
                      </a>
                    </div>
                    <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 mt-1">
                      {m.note || 'Requested a phone callback regarding upcoming tour dates.'}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. Profile Preview Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-5 p-5 bg-[#F8F7F2] rounded-2xl border border-neutral-200/90">
                <img
                  src={guide.photo || generateDefaultGuideAvatar(guide.name)}
                  alt={guide.name}
                  className="w-20 h-20 rounded-full object-cover border-3 border-[#1B4332] shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-neutral-900">{guide.name}</h3>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ★ {guide.rating} ({guide.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1B4332]">{guide.badgeTitle}</p>
                  <p className="text-xs text-neutral-500">
                    {guide.district} · {guide.yearsExperience} years experience · {guide.availability}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                  <span className="font-semibold text-neutral-900">Your Rates:</span>
                  <span className="font-bold text-[#1B4332]">₹{guide.hourlyRate}/hr · ₹{guide.dailyRate}/day</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                  <span className="font-semibold text-neutral-900">Phone & WhatsApp:</span>
                  <span>{guide.phone} {guide.whatsapp ? `· WA: ${guide.whatsapp}` : ''}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-neutral-900">Email:</span>
                  <span>{guide.email}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-1 text-sm">Your Guiding Bio:</span>
                <p className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs sm:text-sm leading-relaxed text-neutral-700">
                  {guide.bio}
                </p>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-1.5 text-sm">Covered Destinations ({guide.coveredDestinations.length}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {guide.coveredDestinations.map((d) => (
                    <span key={d} className="px-3 py-1 bg-white border border-neutral-200 rounded-md text-xs font-medium text-neutral-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5 text-[#E8B960]" />
                  <span>Update Profile or Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Edit Profile & Photo Tab */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEditProfile} className="space-y-6">
              {/* Native Profile Photo Library Picker */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 font-mono">
                  Profile Photo & Avatar
                </label>
                <GuidePhotoUploader
                  currentPhoto={editPhoto}
                  guideName={editName || guide.name}
                  onPhotoSelected={(dataUrl, file) => {
                    setEditPhoto(dataUrl);
                    setSelectedPhotoFile(file);
                  }}
                  onPhotoRemoved={() => {
                    setEditPhoto('');
                    setSelectedPhotoFile(null);
                  }}
                />
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* WhatsApp & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  >
                    <option value="Available Today">Available Today</option>
                    <option value="Weekends Only">Weekends Only</option>
                    <option value="Book in Advance">Book in Advance</option>
                  </select>
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={5000}
                    step={50}
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(Number(e.target.value) || 300)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Day Rate (8 hrs) (₹)
                  </label>
                  <input
                    type="number"
                    min={500}
                    max={20000}
                    step={100}
                    value={editDailyRate}
                    onChange={(e) => setEditDailyRate(Number(e.target.value) || 2000)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Guiding Bio & About *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-3 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className={`py-3 px-6 text-xs sm:text-sm font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                    isSavingProfile ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#E8B960] animate-spin" />
                      <span>Saving Profile Changes...</span>
                    </>
                  ) : savedSuccessNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#E8B960]" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="py-3 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
