import React, { useState } from 'react';
import { Heart, MessageSquare, Camera, MapPin, User, Send, Share2 } from 'lucide-react';
import { CommunityPhoto, Destination } from '../types';

interface CommunitySectionProps {
  photos: CommunityPhoto[];
  onOpenUpload: () => void;
  onLikePhoto: (photoId: string) => void;
  onAddComment: (photoId: string, comment: string, author: string) => void;
  onSelectDestinationById: (destId: string) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  photos,
  onOpenUpload,
  onLikePhoto,
  onAddComment,
  onSelectDestinationById,
}) => {
  const [activeCommentPhotoId, setActiveCommentPhotoId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');

  const handlePostComment = (photoId: string) => {
    if (!commentText.trim()) return;
    onAddComment(photoId, commentText.trim(), commenterName.trim() || 'Fellow Traveler');
    setCommentText('');
    setActiveCommentPhotoId(null);
  };

  return (
    <section className="py-16 bg-[#FBFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
              Traveler Stories & Moments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Karnataka Community Gallery
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Real memories captured by travelers exploring Karnataka’s ancient ruins, misty peaks, and serene coastlines.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4 text-[#E8B960]" />
            <span>Share Your Travel Photo</span>
          </button>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo Image */}
                <div className="relative aspect-[4/3] overflow-hidden group bg-neutral-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1600100397608-f010f443b71d?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onSelectDestinationById(photo.destinationId)}
                    className="absolute top-3 left-3 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-sm flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-[#E8B960]" />
                    <span>{photo.destinationName}</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-800 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      {photo.touristName} {photo.touristLocation && `(${photo.touristLocation})`}
                    </span>
                    <span>{photo.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-neutral-900 mt-2">
                    {photo.title}
                  </h3>

                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    {photo.caption}
                  </p>

                  {/* Likes & Comment counts */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onLikePhoto(photo.id)}
                      className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-red-600 font-semibold cursor-pointer transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500/20 hover:fill-red-500" />
                      <span>{photo.likes} Likes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveCommentPhotoId(
                          activeCommentPhotoId === photo.id ? null : photo.id,
                        )
                      }
                      className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-950 font-medium cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{photo.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Existing Comments preview */}
                  {photo.comments.length > 0 && (
                    <div className="mt-3 space-y-1.5 pt-2 border-t border-neutral-100">
                      {photo.comments.slice(0, 2).map((c) => (
                        <div key={c.id} className="text-[11px] bg-neutral-50 p-2 rounded-lg">
                          <span className="font-semibold text-neutral-900">{c.author}: </span>
                          <span className="text-neutral-600">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* In-card comment form */}
                  {activeCommentPhotoId === photo.id && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={commenterName}
                        onChange={(e) => setCommenterName(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handlePostComment(photo.id)}
                          className="flex-1 text-xs px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handlePostComment(photo.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] rounded-md hover:bg-[#133225] cursor-pointer"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
