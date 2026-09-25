const https = require('https');
const fs = require('fs');
const path = require('path');

const destinationsQueries = [
  { id: 'mysore-palace', name: 'Mysore Palace', query: 'Mysore Palace Karnataka' },
  { id: 'hampi', name: 'Hampi', query: 'Stone Chariot Hampi Karnataka' },
  { id: 'coorg', name: 'Coorg (Madikeri)', query: 'Madikeri Coorg Karnataka' },
  { id: 'chikmagalur', name: 'Chikmagalur', query: 'Chikmagalur Mullayanagiri Karnataka' },
  { id: 'gokarna', name: 'Gokarna', query: 'Om Beach Gokarna Karnataka' },
  { id: 'jog-falls', name: 'Jog Falls', query: 'Jog Falls Karnataka Sharavathi' },
  { id: 'badami', name: 'Badami Cave Temples', query: 'Badami Cave Temples Karnataka' },
  { id: 'pattadakal', name: 'Pattadakal', query: 'Pattadakal Temple Karnataka' },
  { id: 'aihole', name: 'Aihole', query: 'Aihole Durga Temple Karnataka' },
  { id: 'udupi', name: 'Udupi', query: 'Udupi Krishna Temple Karnataka' },
  { id: 'murudeshwar', name: 'Murudeshwar', query: 'Murudeshwar Shiva Temple Karnataka' },
  { id: 'bengaluru', name: 'Bengaluru (Bangalore)', query: 'Vidhana Soudha Bangalore Karnataka' },
  { id: 'kabini', name: 'Kabini River & Wildlife', query: 'Kabini River Karnataka' },
  { id: 'bandipur', name: 'Bandipur National Park', query: 'Bandipur National Park Karnataka' },
  { id: 'nagarhole', name: 'Nagarhole National Park', query: 'Nagarhole National Park Karnataka' },
  { id: 'sakleshpur', name: 'Sakleshpur', query: 'Sakleshpur Manjarabad Fort Karnataka' },
  { id: 'dandeli', name: 'Dandeli', query: 'Dandeli wildlife Karnataka' },
  { id: 'agumbe', name: 'Agumbe', query: 'Agumbe rainforest Karnataka' },
  { id: 'shivamogga', name: 'Shivamogga (Shimoga)', query: 'Shivamogga Shimoga Karnataka' },
  { id: 'belur', name: 'Belur (Chennakeshava Temple)', query: 'Belur Chennakesava Temple Karnataka' },
  { id: 'halebidu', name: 'Halebidu (Hoysaleswara Temple)', query: 'Hoysaleswara temple Halebidu Karnataka' },
  { id: 'sringeri', name: 'Sringeri Sharada Peetham', query: 'Sringeri Sharada Peetham Tunga river Karnataka' },
  { id: 'kudremukh', name: 'Kudremukh Peak', query: 'Kudremukh Karnataka' },
  { id: 'yana-caves', name: 'Yana Rocks & Caves', query: 'Yana rocks Uttara Kannada Karnataka' },
  { id: 'maravanthe', name: 'Maravanthe Beach', query: 'Maravanthe beach highway Karnataka' },
  { id: 'karwar', name: 'Karwar Beach', query: 'Karwar beach Karnataka' },
  { id: 'chitradurga-fort', name: 'Chitradurga Fort', query: 'Chitradurga Fort Karnataka' },
  { id: 'bidar-fort', name: 'Bidar Fort', query: 'Bidar Fort Bahmani Karnataka' },
  { id: 'kemmanagundi', name: 'Kemmanagundi', query: 'Kemmanagundi Karnataka' },
  { id: 'bheemeshwari', name: 'Bheemeshwari (Cauvery Wildlife)', query: 'Cauvery River Bheemeshwari Karnataka' },
  { id: 'skandagiri', name: 'Skandagiri', query: 'Skandagiri hills Karnataka' },
  { id: 'nandi-hills', name: 'Nandi Hills', query: 'Nandi Hills Bangalore Karnataka' },
  { id: 'srirangapatna', name: 'Srirangapatna', query: 'Srirangapatna Ranganathaswamy Tipu Karnataka' },
  { id: 'talakaveri', name: 'Talakaveri (Cauvery Origin)', query: 'Talakaveri Brahmagiri Karnataka' },
  { id: 'dharmasthala', name: 'Dharmasthala', query: 'Dharmasthala Bahubali Karnataka' },
  { id: 'bannerghatta', name: 'Bannerghatta National Park', query: 'Bannerghatta National Park Bangalore Karnataka' },
  { id: 'mekedatu', name: 'Mekedatu & Sangama', query: 'Mekedatu Cauvery gorge Karnataka' },
  { id: 'talakadu', name: 'Talakadu', query: 'Talakadu sand temples Kaveri Karnataka' },
  { id: 'st-marys-islands', name: 'St. Mary’s Islands', query: 'St Marys Islands basalt Malpe Karnataka' },
  { id: 'melukote', name: 'Melukote', query: 'Melukote Cheluvanarayana Kalyani Karnataka' },
  { id: 'shivagange', name: 'Shivagange', query: 'Shivagange hill temple Karnataka' },
  { id: 'iruppu-falls', name: 'Iruppu Falls', query: 'Iruppu falls Coorg Karnataka' },
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'GuidoKarnatakaApp/1.0 (info@guidokarnataka.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function cleanString(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
}

async function searchWikimediaForDestination(item) {
  const apiUrl = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
    encodeURIComponent(item.query) +
    '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata|user&iiurlwidth=1280&format=json';

  try {
    const data = await fetchJson(apiUrl);
    if (!data.query || !data.query.pages) return [];

    const pages = Object.values(data.query.pages);
    const validImages = [];

    for (const page of pages) {
      if (!page.imageinfo || !page.imageinfo[0]) continue;
      const info = page.imageinfo[0];
      const title = page.title || '';

      // Skip non-photos, maps, icons, pdfs, audio
      if (!/\.(jpe?g|png|webp)$/i.test(title)) continue;
      if (/icon|map|logo|flag|diagram|plan|drawing|sketch|stamp|currency|coin/i.test(title)) continue;

      const meta = info.extmetadata || {};
      const artist = cleanString(meta.Artist ? meta.Artist.value : (info.user || 'Wikimedia Contributor'));
      const license = cleanString(meta.LicenseShortName ? meta.LicenseShortName.value : 'CC BY-SA');
      const licenseUrl = meta.LicenseUrl ? meta.LicenseUrl.value : 'https://creativecommons.org/licenses/by-sa/4.0/';
      let caption = cleanString(meta.ObjectName ? meta.ObjectName.value : '');
      if (!caption) {
        caption = title.replace(/^File:/, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      }

      // Use the thumburl or direct url
      const imageUrl = info.thumburl || info.url;
      const sourceUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;

      validImages.push({
        url: imageUrl,
        sourceUrl: sourceUrl,
        image_url: imageUrl,
        source_url: sourceUrl,
        author: artist || 'Wikimedia Contributor',
        license: license || 'CC BY-SA 4.0',
        licenseUrl,
        caption: caption.substring(0, 100),
        title: title
      });

      if (validImages.length >= 4) break;
    }

    return validImages;
  } catch (err) {
    return [];
  }
}

async function run() {
  console.log('Fetching Wikimedia Commons photos for 42 Karnataka destinations...');
  const outPath = path.join(__dirname, '../src/data/verifiedImages.json');
  let results = {};
  if (fs.existsSync(outPath)) {
    try {
      results = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }

  for (let i = 0; i < destinationsQueries.length; i++) {
    const item = destinationsQueries[i];
    if (results[item.id] && results[item.id].images && results[item.id].images.length > 0) {
      console.log(`[${i + 1}/${destinationsQueries.length}] Cached: ${item.name} (${results[item.id].images.length} images)`);
      continue;
    }

    let images = await searchWikimediaForDestination(item);
    if (images.length === 0) {
      const fallbackItem = { ...item, query: `${item.name} Karnataka` };
      images = await searchWikimediaForDestination(fallbackItem);
    }

    console.log(`[${i + 1}/${destinationsQueries.length}] ${item.name}: found ${images.length} images`);

    results[item.id] = {
      id: item.id,
      destination: item.name,
      image: images[0] || null,
      images: images,
      gallery: images
    };

    // Save incrementally
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

    await new Promise(r => setTimeout(r, 80));
  }

  console.log(`\nALL DONE! Verified images saved to ${outPath}`);
}

run();
