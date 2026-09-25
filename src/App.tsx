import React, { useState, useEffect } from 'react';
import { ALL_DESTINATIONS, FEATURED_DESTINATIONS } from './data/destinations';
import { INITIAL_GUIDES } from './data/guides';
import { INITIAL_COMMUNITY_PHOTOS } from './data/community';
import { Destination, Guide, BookingRequest, CommunityPhoto } from './types';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuickCategories } from './components/QuickCategories';
import { DestinationCard } from './components/DestinationCard';
import { GuideCard } from './components/GuideCard';
import { DestinationsView } from './components/DestinationsView';
import { GuidesView } from './components/GuidesView';
import { ExploreView } from './components/ExploreView';
import { CommunitySection } from './components/CommunitySection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

// Modals
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { GuideDetailModal } from './components/GuideDetailModal';
import { BookingModal } from './components/BookingModal';
import { ContactGuideModal } from './components/ContactGuideModal';
import { JoinGuideModal } from './components/JoinGuideModal';
import { GuideDashboardModal } from './components/GuideDashboardModal';
import { CommunityPhotoModal } from './components/CommunityPhotoModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';

import { ArrowRight, Compass, Users, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchFilterQuery, setSearchFilterQuery] = useState<string>('');

  // Persistent Guides State
  const [guides, setGuides] = useState<Guide[]>(() => {
    try {
      const saved = localStorage.getItem('guido_karnataka_guides');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_GUIDES;
  });

  // Persistent Community Photos
  const [communityPhotos, setCommunityPhotos] = useState<CommunityPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('guido_karnataka_photos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_COMMUNITY_PHOTOS;
  });

  // Persistent Bookings
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('guido_karnataka_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  // Persistent Tourist Messages
  const [messages, setMessages] = useState<
    { id: string; guideId: string; name: string; phone: string; note: string; time: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem('guido_karnataka_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  // Current User Session
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    isGuide: boolean;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('guido_karnataka_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return null;
  });

  // Modals state
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookingTarget, setBookingTarget] = useState<{
    guide: Guide;
    destination?: Destination | null;
  } | null>(null);
  const [contactTargetGuide, setContactTargetGuide] = useState<Guide | null>(null);
  const [isJoinGuideOpen, setIsJoinGuideOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [isGuideDashboardOpen, setIsGuideDashboardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [preselectedUploadDest, setPreselectedUploadDest] = useState<Destination | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guido_karnataka_guides', JSON.stringify(guides));
    } catch (e) {
      console.warn(e);
    }
  }, [guides]);

  useEffect(() => {
    try {
      localStorage.setItem('guido_karnataka_photos', JSON.stringify(communityPhotos));
    } catch (e) {
      console.warn(e);
    }
  }, [communityPhotos]);

  useEffect(() => {
    try {
      localStorage.setItem('guido_karnataka_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('guido_karnataka_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn(e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('guido_karnataka_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('guido_karnataka_user');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  // Handlers
  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearchSubmit = (query: string) => {
    setSearchFilterQuery(query);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindGuideForDestination = (dest: Destination) => {
    const matched = guides.find((g) => g.coveredDestinations.includes(dest.id));
    if (matched) {
      setSelectedGuide(matched);
    } else {
      setActiveTab('guides');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookGuide = (guide: Guide, destination?: Destination | null) => {
    setBookingTarget({ guide, destination });
  };

  const handleConfirmBooking = (newBooking: BookingRequest) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleContactGuide = (guide: Guide) => {
    setContactTargetGuide(guide);
  };

  const handleSubmitMessage = (
    guideId: string,
    message: { name: string; phone: string; note: string },
  ) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      guideId,
      name: message.name,
      phone: message.phone,
      note: message.note,
      time: 'Just now',
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleSaveGuide = (newOrUpdatedGuide: Guide) => {
    setGuides((prev) => {
      const exists = prev.some((g) => g.id === newOrUpdatedGuide.id);
      if (exists) {
        return prev.map((g) => (g.id === newOrUpdatedGuide.id ? newOrUpdatedGuide : g));
      }
      return [newOrUpdatedGuide, ...prev];
    });

    setCurrentUser({
      name: newOrUpdatedGuide.name,
      email: newOrUpdatedGuide.email,
      isGuide: true,
    });
    setEditingGuide(null);
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    status: 'Confirmed' | 'Declined' | 'Completed',
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
    );
  };

  const handleLikePhoto = (photoId: string) => {
    setCommunityPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: p.likes + 1 } : p)),
    );
  };

  const handleAddComment = (photoId: string, text: string, author: string) => {
    setCommunityPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author,
            text,
            time: 'Just now',
          };
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      }),
    );
  };

  const handleUploadPhoto = (destination?: Destination) => {
    setPreselectedUploadDest(destination || null);
    setIsUploadPhotoOpen(true);
  };

  const handlePublishPhoto = (newPhoto: CommunityPhoto) => {
    setCommunityPhotos((prev) => [newPhoto, ...prev]);
  };

  // Find user's guide profile if logged in
  const userGuideProfile = guides.find(
    (g) => g.isCustomGuide || (currentUser && g.name.toLowerCase() === currentUser.name.toLowerCase()),
  ) || guides[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-neutral-900 selection:bg-[#1B4332] selection:text-white font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenJoinGuide={() => {
          setEditingGuide(null);
          setIsJoinGuideOpen(true);
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        activeGuideCount={guides.length}
        currentUser={currentUser}
        onOpenGuideDashboard={() => setIsGuideDashboardOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => {
                setActiveTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onJoinGuideClick={() => {
                setEditingGuide(null);
                setIsJoinGuideOpen(true);
              }}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              onSearchSubmit={handleHeroSearchSubmit}
            />

            {/* Quick Destination Categories */}
            <QuickCategories
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Featured Destinations Showcase */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
                    Curated Highlights
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
                    Featured Karnataka Destinations
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setActiveTab('destinations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4332] hover:text-[#0C2B20] cursor-pointer"
                >
                  <span>Explore all 42+ destinations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of 6 Featured Destinations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURED_DESTINATIONS.slice(0, 6).map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    onExplore={(d) => setSelectedDestination(d)}
                    onFindGuide={handleFindGuideForDestination}
                  />
                ))}
              </div>
            </section>

            {/* Featured Local Guides Section */}
            <section className="py-16 bg-[#F6F4ED] border-y border-neutral-200/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#1B4332] font-semibold">
                      Direct Connection
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
                      Meet Karnataka’s Local Guides
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Certified epigraphists, coffee estate naturalists, and multi-lingual regional experts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('guides');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4332] hover:text-[#0C2B20] cursor-pointer"
                  >
                    <span>Browse all {guides.length} guides</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.slice(0, 3).map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                      onBook={(g) => handleBookGuide(g)}
                      onContact={(g) => handleContactGuide(g)}
                      onViewProfile={(g) => setSelectedGuide(g)}
                      destinations={ALL_DESTINATIONS}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Community Section Preview */}
            <CommunitySection
              photos={communityPhotos.slice(0, 3)}
              onOpenUpload={() => handleUploadPhoto()}
              onLikePhoto={handleLikePhoto}
              onAddComment={handleAddComment}
              onSelectDestinationById={(destId) => {
                const dest = ALL_DESTINATIONS.find((d) => d.id === destId);
                if (dest) setSelectedDestination(dest);
              }}
            />
          </>
        )}

        {activeTab === 'explore' && (
          <ExploreView
            destinations={ALL_DESTINATIONS}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeTab === 'destinations' && (
          <DestinationsView
            destinations={ALL_DESTINATIONS}
            initialCategory={selectedCategory}
            initialDistrict={selectedDistrict}
            initialSearch={searchFilterQuery}
            onExploreDestination={(dest) => setSelectedDestination(dest)}
            onFindGuideForDestination={handleFindGuideForDestination}
          />
        )}

        {activeTab === 'guides' && (
          <GuidesView
            guides={guides}
            destinations={ALL_DESTINATIONS}
            onBookGuide={(g) => handleBookGuide(g)}
            onContactGuide={(g) => handleContactGuide(g)}
            onViewGuideProfile={(g) => setSelectedGuide(g)}
            onOpenJoinGuide={() => {
              setEditingGuide(null);
              setIsJoinGuideOpen(true);
            }}
          />
        )}

        {activeTab === 'community' && (
          <CommunitySection
            photos={communityPhotos}
            onOpenUpload={() => handleUploadPhoto()}
            onLikePhoto={handleLikePhoto}
            onAddComment={handleAddComment}
            onSelectDestinationById={(destId) => {
              const dest = ALL_DESTINATIONS.find((d) => d.id === destId);
              if (dest) setSelectedDestination(dest);
            }}
          />
        )}

        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenJoinGuide={() => {
          setEditingGuide(null);
          setIsJoinGuideOpen(true);
        }}
        onFilterDistrict={(dist) => {
          setSelectedDistrict(dist);
          setActiveTab('destinations');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      {/* 1. Destination Detail Modal */}
      {selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          guides={guides}
          onClose={() => setSelectedDestination(null)}
          onBookGuide={(guide, dest) => {
            setSelectedDestination(null);
            setBookingTarget({ guide, destination: dest });
          }}
          onContactGuide={(guide) => {
            setContactTargetGuide(guide);
          }}
          onUploadPhoto={(dest) => {
            handleUploadPhoto(dest);
          }}
        />
      )}

      {/* 2. Guide Detail Modal */}
      {selectedGuide && (
        <GuideDetailModal
          guide={selectedGuide}
          destinations={ALL_DESTINATIONS}
          onClose={() => setSelectedGuide(null)}
          onBook={(guide) => {
            setSelectedGuide(null);
            setBookingTarget({ guide, destination: null });
          }}
          onContact={(guide) => {
            setContactTargetGuide(guide);
          }}
          onSelectDestination={(dest) => {
            setSelectedGuide(null);
            setSelectedDestination(dest);
          }}
          isCurrentUserGuide={
            Boolean(currentUser?.isGuide) &&
            (selectedGuide.isCustomGuide || selectedGuide.name === currentUser?.name)
          }
          onEditGuide={(guide) => {
            setSelectedGuide(null);
            setEditingGuide(guide);
            setIsJoinGuideOpen(true);
          }}
        />
      )}

      {/* 3. Booking Modal */}
      {bookingTarget && (
        <BookingModal
          guide={bookingTarget.guide}
          destination={bookingTarget.destination}
          destinations={ALL_DESTINATIONS}
          onClose={() => setBookingTarget(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* 4. Contact / Call Guide Modal */}
      {contactTargetGuide && (
        <ContactGuideModal
          guide={contactTargetGuide}
          onClose={() => setContactTargetGuide(null)}
          onSubmitMessage={handleSubmitMessage}
        />
      )}

      {/* 5. Join / Edit Guide Modal */}
      {isJoinGuideOpen && (
        <JoinGuideModal
          existingGuide={editingGuide}
          destinations={ALL_DESTINATIONS}
          onClose={() => {
            setIsJoinGuideOpen(false);
            setEditingGuide(null);
          }}
          onSaveGuide={handleSaveGuide}
        />
      )}

      {/* 6. Guide Self-service Portal Modal */}
      {isGuideDashboardOpen && (
        <GuideDashboardModal
          guide={userGuideProfile}
          bookings={bookings}
          messages={messages}
          onClose={() => setIsGuideDashboardOpen(false)}
          onEditProfile={() => {
            setIsGuideDashboardOpen(false);
            setEditingGuide(userGuideProfile);
            setIsJoinGuideOpen(true);
          }}
          onSaveProfile={handleSaveGuide}
          onUpdateBookingStatus={handleUpdateBookingStatus}
        />
      )}

      {/* 7. Community Photo Upload Modal */}
      {isUploadPhotoOpen && (
        <CommunityPhotoModal
          destinations={ALL_DESTINATIONS}
          preselectedDest={preselectedUploadDest}
          onClose={() => {
            setIsUploadPhotoOpen(false);
            setPreselectedUploadDest(null);
          }}
          onSubmitPhoto={handlePublishPhoto}
        />
      )}

      {/* 8. Universal Search Modal */}
      {isSearchOpen && (
        <SearchModal
          destinations={ALL_DESTINATIONS}
          guides={guides}
          onClose={() => setIsSearchOpen(false)}
          onSelectDestination={(dest) => {
            setIsSearchOpen(false);
            setSelectedDestination(dest);
          }}
          onSelectGuide={(guide) => {
            setIsSearchOpen(false);
            setSelectedGuide(guide);
          }}
        />
      )}

      {/* 9. Authentication Modal */}
      {isAuthOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
          }}
          onOpenJoinGuide={() => {
            setEditingGuide(null);
            setIsJoinGuideOpen(true);
          }}
        />
      )}
    </div>
  );
}
