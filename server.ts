import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Increase payload limits for base64 photo uploads up to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'guides');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded guide photos statically
app.use('/uploads/guides', express.static(uploadDir));

// Initialize Gemini API client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * API: Guide Profile Photo Upload
 * Saves the photo to /public/uploads/guides/ and returns the permanent URL
 */
app.post('/api/upload/guide-photo', async (req, res) => {
  try {
    const { imageData, fileName, guideId } = req.body;

    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Extract base64 content and extension
    const matches = imageData.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format, base64 data expected' });
    }

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Enforce 5MB limit
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds maximum allowed 5MB limit' });
    }

    const safeGuideId = (guideId || 'guide').replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueFileName = `${safeGuideId}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/guides/${uniqueFileName}`;
    return res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error('Error handling guide photo upload:', error);
    return res.status(500).json({ error: 'Failed to process and store guide photo' });
  }
});

/**
 * API: Google Maps Grounding via Gemini 2.5 Flash
 * Model: models/gemini-2.5-flash with googleMaps tool
 * Returns up-to-date Karnataka place information, timings, travel intel, and clickable Google Maps links
 */
app.post('/api/maps/grounding', async (req, res) => {
  try {
    const { destinationName, district, query, latitude, longitude } = req.body;

    const targetPlace = destinationName || query || 'Karnataka, India';
    const prompt = query ||
      `Provide concise, accurate travel intel for ${targetPlace} in ${district || 'Karnataka'}. ` +
      `Include current visiting hours/timings, key entry guidelines, best access route or transit hub, and 2-3 top nearby highlights. Keep it informative, structured, and traveler-friendly.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude,
            longitude,
          },
        },
      };
    }

    // Call gemini-2.5-flash with Google Maps tool
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract Google Maps links
    const mapsLinks: Array<{ title: string; uri: string }> = [];
    for (const chunk of groundingChunks as any[]) {
      if (chunk.maps?.uri) {
        mapsLinks.push({
          title: chunk.maps.title || targetPlace,
          uri: chunk.maps.uri,
        });
      }
    }

    return res.json({
      success: true,
      text,
      mapsLinks,
      destinationName: targetPlace,
    });
  } catch (error: any) {
    console.error('Error in Google Maps Grounding:', error);
    return res.status(500).json({
      error: 'Unable to retrieve Google Maps data at this moment',
      details: error.message,
    });
  }
});

// Configure Vite or Static Serving
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Guido server running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
