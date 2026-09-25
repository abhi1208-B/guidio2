import { Destination, WikimediaImage } from '../types';
import { DESTINATIONS_PART_1 } from './destinationsPart1';
import { DESTINATIONS_PART_2 } from './destinationsPart2';
import verifiedImagesData from './verifiedImages.json';

const verifiedMap = verifiedImagesData as Record<
  string,
  {
    id: string;
    destination: string;
    image: WikimediaImage;
    images: WikimediaImage[];
    gallery: WikimediaImage[];
  }
>;

export const ALL_DESTINATIONS: Destination[] = [
  ...DESTINATIONS_PART_1,
  ...DESTINATIONS_PART_2,
].map((dest) => {
  const verified = verifiedMap[dest.id];
  if (verified && verified.image) {
    return {
      ...dest,
      image: verified.image,
      images: verified.images && verified.images.length > 0 ? verified.images : [verified.image],
      gallery: verified.gallery && verified.gallery.length > 0 ? verified.gallery : [verified.image],
    };
  }
  return {
    ...dest,
    images: dest.gallery && dest.gallery.length > 0 ? dest.gallery : [dest.image],
  };
});

export const FEATURED_DESTINATIONS: Destination[] = ALL_DESTINATIONS.filter(
  (dest) => dest.featured,
);

export function getDestinationById(id: string): Destination | undefined {
  return ALL_DESTINATIONS.find((dest) => dest.id === id);
}

export function getDestinationsByCategory(category: string): Destination[] {
  if (category === 'All') return ALL_DESTINATIONS;
  return ALL_DESTINATIONS.filter(
    (dest) =>
      dest.category === category ||
      (dest.additionalCategories && dest.additionalCategories.includes(category as any)),
  );
}

export function searchDestinations(query: string): Destination[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_DESTINATIONS;
  return ALL_DESTINATIONS.filter(
    (dest) =>
      dest.name.toLowerCase().includes(q) ||
      dest.district.toLowerCase().includes(q) ||
      dest.category.toLowerCase().includes(q) ||
      dest.shortDescription.toLowerCase().includes(q) ||
      dest.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
}
