import React, { useState } from 'react';
import { X, Phone, MessageSquare, Send, CheckCircle2, User, Mail } from 'lucide-react';
import { Guide } from '../types';

interface ContactGuideModalProps {
  guide: Guide;
  onClose: () => void;
  onSubmitMessage: (guideId: string, message: { name: string; phone: string; note: string }) => void;
}

export const ContactGuideModal: React.FC<ContactGuideModalProps> = ({
  guide,
  onClose,
  onSubmitMessage,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = guide.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${guide.name}! I found your profile on Guido Karnataka and would like to ask about local guiding in ${guide.district}.`,
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSubmitMessage(guide.id, { name, phone, note });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Contact Local Guide
            </h3>
            <p className="text-xs text-neutral-500">
              Direct connection with {guide.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Guide Quick Profile */}
          <div className="flex items-center gap-3.5 p-3.5 bg-[#F8F7F2] rounded-xl border border-neutral-200/70">
            <img
              src={guide.photo}
              alt={guide.name}
              className="w-14 h-14 rounded-full object-cover border border-neutral-300"
            />
            <div>
              <div className="font-bold text-neutral-900">{guide.name}</div>
              <div className="text-xs text-[#1B4332] font-semibold">{guide.badgeTitle}</div>
              <div className="text-xs text-neutral-500">
                {guide.district} · Speaks {guide.languages.join(', ')}
              </div>
            </div>
          </div>

          {/* Quick Connect Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${guide.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Direct</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-xs font-mono uppercase text-neutral-400">
              Or Send in-app message
            </span>
          </div>

          {/* Message Form */}
          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-emerald-900 text-sm">Message Delivered!</div>
              <p className="text-xs text-emerald-700">
                {guide.name} has received your inquiry and will call or text you shortly on {phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand R"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  What would you like to ask or plan?
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Planning a visit next Friday for 4 adults. Looking for historical highlights and temple insights..."
                  className="w-full p-3 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#1B4332]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#E8B960]" />
                <span>Send Request to Guide</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
