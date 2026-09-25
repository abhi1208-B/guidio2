import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { validateProfilePhoto, readFileAsDataURL, generateDefaultGuideAvatar } from '../utils/photoStorage';

interface GuidePhotoUploaderProps {
  currentPhoto: string;
  guideName?: string;
  onPhotoSelected: (dataUrl: string, file: File | null) => void;
  onPhotoRemoved: () => void;
  className?: string;
}

export const GuidePhotoUploader: React.FC<GuidePhotoUploaderProps> = ({
  currentPhoto,
  guideName = 'Guide',
  onPhotoSelected,
  onPhotoRemoved,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Check if we have an active custom photo (either data URL or uploaded URL)
  const hasPhoto = Boolean(currentPhoto && !currentPhoto.startsWith('data:image/svg+xml'));
  const displayAvatar = hasPhoto ? currentPhoto : generateDefaultGuideAvatar(guideName);

  const handleOpenPicker = () => {
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessNotice(null);

    const validation = validateProfilePhoto(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid photo. Please choose a JPG, PNG, or WEBP under 5MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      onPhotoSelected(dataUrl, file);
      setSuccessNotice(`Photo selected: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
      setTimeout(() => setSuccessNotice(null), 3500);
    } catch (err) {
      setErrorMessage('Could not load image from your device. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoRemoved();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload guide profile photo from device"
      />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-[#FBFBF9] rounded-2xl border border-neutral-200/90 shadow-2xs">
        {/* Circular photo preview */}
        <div
          onClick={handleOpenPicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 cursor-pointer shrink-0 transition-all duration-200 shadow-md ${
            isDragging
              ? 'border-[#E8B960] scale-105 ring-4 ring-[#E8B960]/30'
              : 'border-[#1B4332] hover:border-[#133225]'
          }`}
          title="Click to choose a photo from your photo library"
        >
          <img
            src={displayAvatar}
            alt={`${guideName} profile preview`}
            className="w-full h-full object-cover object-center"
          />

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 mb-1 text-[#E8B960]" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">
              {hasPhoto ? 'Change' : 'Upload'}
            </span>
          </div>
        </div>

        {/* Action Controls & Description */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              Profile Photo
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select an authentic photo from your computer or mobile library.
              Clear face photos build trust with tourists.
            </p>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
              Supported: JPG, JPEG, PNG, WEBP · Max 5 MB
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {!hasPhoto ? (
              <button
                type="button"
                onClick={handleOpenPicker}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-[#E8B960]" />
                <span>Choose Photo</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleOpenPicker}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success notice */}
          {successNotice && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
