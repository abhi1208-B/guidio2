import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Globe, Award, Shield, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import { Guide, Destination } from '../types';
import { GuidePhotoUploader } from './GuidePhotoUploader';
import { uploadGuidePhoto, generateDefaultGuideAvatar } from '../utils/photoStorage';

interface JoinGuideModalProps {
  onClose: () => void;
  onSaveGuide: (guide: Guide) => void;
  destinations: Destination[];
  existingGuide?: Guide | null;
}

export const JoinGuideModal: React.FC<JoinGuideModalProps> = ({
  onClose,
  onSaveGuide,
  destinations,
  existingGuide,
}) => {
  const isEditing = Boolean(existingGuide);

  const [name, setName] = useState(existingGuide?.name || '');
  const [photo, setPhoto] = useState(existingGuide?.photo || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [phone, setPhone] = useState(existingGuide?.phone || '');
  const [email, setEmail] = useState(existingGuide?.email || '');
  const [whatsapp, setWhatsapp] = useState(existingGuide?.whatsapp || '');
  const [district, setDistrict] = useState(existingGuide?.district || 'Mysuru');
  const [badgeTitle, setBadgeTitle] = useState(
    existingGuide?.badgeTitle || 'Heritage & Cultural Guide',
  );
  const [yearsExperience, setYearsExperience] = useState(existingGuide?.yearsExperience || 5);
  const [hourlyRate, setHourlyRate] = useState(existingGuide?.hourlyRate || 400);
  const [dailyRate, setDailyRate] = useState(existingGuide?.dailyRate || 2500);
  const [bio, setBio] = useState(existingGuide?.bio || '');
  const [availability, setAvailability] = useState<
    'Available Today' | 'Weekends Only' | 'Book in Advance'
  >(existingGuide?.availability || 'Available Today');

  // Multi-select for languages
  const allLanguages = ['Kannada', 'English', 'Hindi', 'Tulu', 'Konkani', 'Kodava Takk', 'Telugu', 'Tamil', 'Marathi', 'French', 'German'];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    existingGuide?.languages || ['Kannada', 'English'],
  );

  // Multi-select for covered destinations
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    existingGuide?.coveredDestinations || ['mysore-palace', 'srirangapatna'],
  );

  // Specialties
  const [specialtiesText, setSpecialtiesText] = useState(
    existingGuide?.specialties.join(', ') || 'Local History, Temple Architecture, Food Walks',
  );

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const toggleDestination = (destId: string) => {
    if (selectedDestinations.includes(destId)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter((d) => d !== destId));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, destId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !bio.trim() || isSaving) return;

    setIsSaving(true);

    try {
      const guideId = existingGuide?.id || `guide-local-${Date.now()}`;
      let finalPhoto = photo;

      // Upload to application storage if a new local file or data URL was selected
      if (selectedFile) {
        finalPhoto = await uploadGuidePhoto(selectedFile, guideId);
      } else if (photo && photo.startsWith('data:image/')) {
        finalPhoto = await uploadGuidePhoto(photo, guideId);
      }

      // If no photo or photo was removed, generate default dignified monogram avatar
      if (!finalPhoto) {
        finalPhoto = generateDefaultGuideAvatar(name);
      }

      const specialtiesList = specialtiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const guideData: Guide = {
        id: guideId,
        name,
        photo: finalPhoto,
        phone,
        whatsapp: whatsapp.trim() || phone.replace(/\D/g, ''),
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@guidokarnataka.com`,
        district,
        coveredDestinations: selectedDestinations,
        languages: selectedLanguages,
        yearsExperience: Number(yearsExperience),
        rating: existingGuide?.rating || 5.0,
        reviewCount: existingGuide?.reviewCount || 1,
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate),
        bio,
        badgeTitle,
        specialties: specialtiesList.length > 0 ? specialtiesList : ['Local Heritage', 'Nature Trails'],
        verified: true,
        availability,
        joinedDate: existingGuide?.joinedDate || 'Recently Joined',
        isCustomGuide: true,
      };

      onSaveGuide(guideData);
      onClose();
    } catch (error) {
      console.error('Error saving guide profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FBFBF9]">
          <div>
            <h3 className="font-serif font-bold text-xl text-neutral-900">
              {isEditing ? 'Edit Your Guide Profile' : 'Join Guido as a Local Guide'}
            </h3>
            <p className="text-xs text-neutral-500">
              Empowering local Karnataka residents to share regional culture & earn directly
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Native Local Photo Library Picker */}
          <GuidePhotoUploader
            currentPhoto={photo}
            guideName={name || 'Local Guide'}
            onPhotoSelected={(dataUrl, file) => {
              setPhoto(dataUrl);
              setSelectedFile(file);
            }}
            onPhotoRemoved={() => {
              setPhoto('');
              setSelectedFile(null);
            }}
          />

          {/* Full Name & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anand Kumar"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Professional Title / Badge *
              </label>
              <input
                type="text"
                required
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                placeholder="e.g. Hampi Historian & Trek Guide"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Phone, WhatsApp, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="919845012345"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anand@example.com"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* District & Years of Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Primary District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              >
                {[
                  'Mysuru',
                  'Vijayanagara',
                  'Kodagu',
                  'Chikkamagaluru',
                  'Uttara Kannada',
                  'Udupi',
                  'Dakshina Kannada',
                  'Shivamogga',
                  'Hassan',
                  'Bengaluru Urban',
                  'Bagalkote',
                  'Chitradurga',
                  'Bidar',
                  'Mandya',
                  'Ramanagara',
                  'Chikkaballapura',
                ].map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Years of Guiding Experience
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Languages Spoken (Multi-select) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Languages Spoken (Click to toggle) *
            </label>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destinations Covered (Multi-select) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Destinations & Circuits You Cover (Select 2 or more)
            </label>
            <div className="max-h-36 overflow-y-auto p-2 bg-neutral-50 rounded-lg border border-neutral-300 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {destinations.map((d) => {
                const isSelected = selectedDestinations.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDestination(d.id)}
                    className={`text-left px-2 py-1 rounded text-xs truncate transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B4332] text-white font-medium'
                        : 'bg-white text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hourly & Daily Rates */}
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
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value) || 300)}
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
                value={dailyRate}
                onChange={(e) => setDailyRate(parseInt(e.target.value) || 2000)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              General Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="Available Today">Available Today</option>
              <option value="Weekends Only">Weekends Only</option>
              <option value="Book in Advance">Book in Advance</option>
            </select>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Specialties (comma-separated)
            </label>
            <input
              type="text"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="e.g. Temple Architecture, Monsoon Treks, Traditional Cuisine"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Bio / About */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Bio & Guiding Philosophy *
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your background, regional roots, historical knowledge, favorite spots, and what travelers can look forward to experiencing with you..."
              className="w-full p-3 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
              isSaving ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-[#E8B960] animate-spin" />
                <span>Storing Photo & Updating Guide Database...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#E8B960]" />
                <span>{isEditing ? 'Save Profile Changes' : 'Publish Guide Profile'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
