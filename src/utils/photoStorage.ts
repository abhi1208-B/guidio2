/**
 * Photo Storage Utility for Guido Karnataka Guides
 * Supports local photo library selection, validation (JPG, JPEG, PNG, WEBP <= 5MB),
 * immediate preview, upload to application storage, and fallback avatar generation.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface PhotoValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates selected file for type and size
 */
export function validateProfilePhoto(file: File): PhotoValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file type
  const isTypeValid = ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpg|jpeg|png|webp)$/i.test(file.name);

  if (!isTypeValid) {
    return {
      valid: false,
      error: 'Unsupported format. Please select a JPG, JPEG, PNG, or WEBP image.',
    };
  }

  // Check size (<= 5MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeInMB} MB). Maximum allowed size is 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Converts File to Base64 Data URL for instant preview and offline persistence
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an elegant SVG avatar badge with initials when no photo is uploaded or photo is removed.
 * Uses Guido's deep forest green and gold colors.
 */
export function generateDefaultGuideAvatar(name: string): string {
  const cleanName = (name || 'Guide').trim();
  const initials = cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'G';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1B4332" />
        <stop offset="100%" stop-color="#0C251B" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F2D07C" />
        <stop offset="100%" stop-color="#C98A2C" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="100" fill="url(#bg)" />
    <circle cx="100" cy="100" r="92" fill="none" stroke="url(#gold)" stroke-width="4" stroke-opacity="0.8" />
    <circle cx="100" cy="100" r="88" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.2" />
    <text x="100" y="118" font-family="'Cinzel', Georgia, serif" font-size="64" font-weight="700" fill="url(#gold)" text-anchor="middle" letter-spacing="2">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Uploads guide photo to application storage API (`/api/upload/guide-photo`)
 * Falls back to local persistent data URL if offline or API is unreachable
 */
export async function uploadGuidePhoto(
  fileOrDataUrl: File | string,
  guideId: string = 'guide',
): Promise<string> {
  try {
    let dataUrl: string;
    let fileName = `profile-photo-${Date.now()}.jpg`;

    if (fileOrDataUrl instanceof File) {
      dataUrl = await readFileAsDataURL(fileOrDataUrl);
      const extMatch = fileOrDataUrl.name.match(/\.(jpe?g|png|webp)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
      fileName = `profile-${guideId}-${Date.now()}.${ext}`;
    } else {
      dataUrl = fileOrDataUrl;
    }

    // Try posting to application storage endpoint
    const response = await fetch('/api/upload/guide-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guideId,
        fileName,
        imageData: dataUrl,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.info('Backend upload endpoint unavailable, persisting locally:', err);
  }

  // Graceful fallback to persistent base64 data URL
  if (fileOrDataUrl instanceof File) {
    return await readFileAsDataURL(fileOrDataUrl);
  }
  return fileOrDataUrl;
}
