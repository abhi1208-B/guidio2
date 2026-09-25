import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Guide, Destination, BookingRequest } from '../types';

interface BookingModalProps {
  guide: Guide;
  destination?: Destination | null;
  destinations: Destination[];
  onClose: () => void;
  onConfirmBooking: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  guide,
  destination,
  destinations,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedDestId, setSelectedDestId] = useState(
    destination?.id || guide.coveredDestinations[0] || '',
  );
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  );
  const [duration, setDuration] = useState<'4_hours' | '8_hours' | '2_days'>('8_hours');
  const [guestsCount, setGuestsCount] = useState(2);
  const [touristName, setTouristName] = useState('');
  const [touristEmail, setTouristEmail] = useState('');
  const [touristPhone, setTouristPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);

  const selectedDest = destinations.find((d) => d.id === selectedDestId);

  // Calculate estimated total
  const estimatedCost =
    duration === '4_hours'
      ? guide.hourlyRate * 4
      : duration === '8_hours'
      ? guide.dailyRate
      : guide.dailyRate * 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!touristName.trim() || !touristPhone.trim()) return;

    const newBooking: BookingRequest = {
      id: `book-${Date.now()}`,
      guideId: guide.id,
      guideName: guide.name,
      destinationId: selectedDestId,
      destinationName: selectedDest?.name || 'Karnataka Circuit',
      touristName,
      touristEmail,
      touristPhone,
      date,
      duration:
        duration === '4_hours'
          ? 'Half Day (4 hours)'
          : duration === '8_hours'
          ? 'Full Day (8 hours)'
          : '2 Days Tour',
      guestsCount,
      specialNotes,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString(),
    };

    onConfirmBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FBFBF9]">
          <div>
            <h3 className="font-serif font-bold text-xl text-neutral-900">
              Book a Certified Local Guide
            </h3>
            <p className="text-xs text-neutral-500">
              Guaranteed direct price with no agency markups
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {confirmedBooking ? (
            /* Success confirmation card */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-neutral-900">
                Booking Request Sent!
              </h4>
              <p className="text-sm text-neutral-600 max-w-md mx-auto">
                Your request has been forwarded directly to{' '}
                <span className="font-semibold text-neutral-900">{guide.name}</span>. They will
                contact you on{' '}
                <span className="font-semibold text-neutral-900">{touristPhone}</span> to confirm
                meeting points and details.
              </p>

              <div className="p-4 bg-[#F8F7F2] rounded-xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-neutral-800">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination:</span>
                  <span className="font-semibold text-neutral-800">
                    {confirmedBooking.destinationName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date & Duration:</span>
                  <span className="font-medium text-neutral-800">
                    {confirmedBooking.date} · {confirmedBooking.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Guide Fee:</span>
                  <span className="font-bold text-[#1B4332]">₹{estimatedCost}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#1B4332] rounded-lg cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Guide Banner */}
              <div className="flex items-center gap-3.5 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-12 h-12 rounded-full object-cover border border-emerald-300 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900 text-sm">{guide.name}</span>
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <div className="text-xs text-emerald-900">{guide.badgeTitle}</div>
                  <div className="text-[11px] text-neutral-500">
                    Rate: ₹{guide.hourlyRate}/hr · ₹{guide.dailyRate}/day
                  </div>
                </div>
              </div>

              {/* Destination Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Destination or Circuit
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <select
                    value={selectedDestId}
                    onChange={(e) => setSelectedDestId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#1B4332]"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tour Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tour Duration
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as any)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                    >
                      <option value="4_hours">Half Day (4 hrs) · ₹{guide.hourlyRate * 4}</option>
                      <option value="8_hours">Full Day (8 hrs) · ₹{guide.dailyRate}</option>
                      <option value="2_days">2 Days Immersion · ₹{guide.dailyRate * 2}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Number of Travelers
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tourist Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={touristName}
                    onChange={(e) => setTouristName(e.target.value)}
                    placeholder="e.g. Ramesh Hegde"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={touristPhone}
                    onChange={(e) => setTouristPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email (for booking receipt)
                </label>
                <input
                  type="email"
                  value={touristEmail}
                  onChange={(e) => setTouristEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Special Requests / Preferred Pace
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Traveling with senior parents, prefer leisurely walk with morning temple visit..."
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Price Estimation Bar */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-500">Estimated Guide Honorarium</div>
                  <div className="text-lg font-serif font-bold text-[#1B4332]">
                    ₹{estimatedCost}
                  </div>
                </div>
                <div className="text-[11px] text-neutral-500 text-right">
                  Pay directly to guide on tour day
                  <div className="font-semibold text-emerald-700">Zero Advance Deposi required</div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Send Booking Request</span>
                <ArrowRight className="w-4 h-4 text-[#E8B960]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
