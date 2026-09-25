export type DestinationCategory =
  | 'Heritage'
  | 'Waterfalls'
  | 'Beaches'
  | 'Hill Stations'
  | 'Wildlife'
  | 'Temples'
  | 'Forts'
  | 'Adventure'
  | 'Culture'
  | 'Food'
  | 'Offbeat Places';

export interface WikimediaImage {
  url: string;
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl?: string;
  caption?: string;
  image_url?: string;
  source_url?: string;
}

export interface Destination {
  id: string;
  name: string;
  kannadaName: string;
  district: string;
  region: 'Malnad' | 'Coastal Karnataka' | 'North Karnataka' | 'South Karnataka' | 'Central Karnataka';
  category: DestinationCategory;
  additionalCategories?: DestinationCategory[];
  shortDescription: string;
  detailedDescription: string;
  bestTimeToVisit: string;
  approximateDuration: string;
  idealFor: string;
  entryFee: string;
  timings: string;
  nearestHub: string;
  thingsToDo: string[];
  nearbyAttractions: string[];
  travelTips: string[];
  image: WikimediaImage;
  images?: WikimediaImage[];
  gallery: WikimediaImage[];
  tags: string[];
  guideIds: string[];
  featured?: boolean;
}

export interface Guide {
  id: string;
  name: string;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  district: string;
  coveredDestinations: string[];
  languages: string[];
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  dailyRate: number;
  bio: string;
  badgeTitle: string;
  specialties: string[];
  verified: boolean;
  availability: 'Available Today' | 'Weekends Only' | 'Book in Advance';
  joinedDate?: string;
  isCustomGuide?: boolean;
}

export interface BookingRequest {
  id: string;
  guideId: string;
  guideName: string;
  destinationId: string;
  destinationName: string;
  touristName: string;
  touristEmail: string;
  touristPhone: string;
  date: string;
  duration: string;
  guestsCount: number;
  specialNotes?: string;
  status: 'Pending' | 'Confirmed' | 'Declined' | 'Completed';
  createdAt: string;
}

export interface CommunityPhoto {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  imageUrl: string;
  touristName: string;
  touristLocation: string;
  date: string;
  likes: number;
  isLikedByUser?: boolean;
  caption: string;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    time: string;
  }>;
}

export interface CategoryInfo {
  id: DestinationCategory;
  name: string;
  kannadaName: string;
  count: number;
  tagline: string;
  iconName: string;
}
