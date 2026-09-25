import React, { useState } from 'react';
import { X, Camera, MapPin, User, Send, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Destination, CommunityPhoto } from '../types';

interface CommunityPhotoModalProps {
  destinations: Destination[];
  preselectedDest?: Destination | null;
  onClose: () => void;
  onSubmitPhoto: (photo: CommunityPhoto) => void;
}

export const CommunityPhotoModal: React.FC<CommunityPhotoModalProps> = ({
  destinations,
  preselectedDest,
  onClose,
  onSubmitPhoto,
}) => {
  const [destId, setDestId] = useState(preselectedDest?.id || destinations[0]?.id || '');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [touristName, setTouristName] = useState('');
  const [touristLocation, setTouristLocation] = useState('Bengaluru');
  const [submitted, setSubmitted] = useState(false);

  const samplePhotoUrls = [
    'https://images.unsplash.com/photo-1600100397608-f010f443b71d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !touristName.trim()) return;

    const matchedDest = destinations.find((d) => d.id === destId);
    const chosenUrl = imageUrl.trim() || samplePhotoUrls[0];

    const newPhoto: CommunityPhoto = {
      id: `comm-${Date.now()}`,
      title,
      destinationId: destId,
      destinationName: matchedDest?.name || 'Karnataka',
      imageUrl: chosenUrl,
      touristName,
      touristLocation,
      date: 'Just now',
      likes: 1,
      caption,
      comments: [],
    };

    onSubmitPhoto(newPhoto);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FBFBF9]">
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Share Your Karnataka Travel Memory
            </h3>
            <p className="text-xs text-neutral-500">
              Inspire fellow travelers exploring Karnataka
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

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-neutral-900">
                Photo Published to Community!
              </h4>
              <p className="text-xs text-neutral-600">
                Thank you for contributing to the Guido traveler network.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Destination Tag *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Photo Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Golden sunset over Tungabhadra river boulders"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Direct image URL or pick sample below"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500">Preset photo:</span>
                  {samplePhotoUrls.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(url)}
                      className="w-10 h-7 rounded-sm overflow-hidden border border-neutral-300 hover:border-[#1B4332]"
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={touristName}
                    onChange={(e) => setTouristName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Home City
                  </label>
                  <input
                    type="text"
                    value={touristLocation}
                    onChange={(e) => setTouristLocation(e.target.value)}
                    placeholder="e.g. Mysuru / Mumbai"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Story / Caption & Guide Shoutout
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share a short note about the moment, tips for other travelers, or how your guide helped you discover this spot..."
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#E8B960]" />
                <span>Publish Photo</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
