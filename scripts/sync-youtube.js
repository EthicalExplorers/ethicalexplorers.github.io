/**
 * Ethical Explorers — Automated YouTube Channel Video Sync Script
 * Channel: @ethicalexplorers18 (Channel ID: UCRF-_Xekdp-pCV7xdSkcoVA)
 * Fetches official YouTube RSS Feed and updates data/videos.json automatically.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CHANNEL_ID = 'UCRF-_Xekdp-pCV7xdSkcoVA';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const ROOT_DIR = path.resolve(__dirname, '..');
const VIDEOS_PATH = path.join(ROOT_DIR, 'data', 'videos.json');

function categorizeVideo(title) {
  const lower = title.toLowerCase();
  if (lower.includes('osint') || lower.includes('recon') || lower.includes('find any account') || lower.includes('track usernames') || lower.includes('geolocation') || lower.includes('bbot') || lower.includes('blackbird')) {
    return 'OSINT & Recon';
  }
  if (lower.includes('linux') || lower.includes('android') || lower.includes('nethunter') || lower.includes('termux') || lower.includes('commands') || lower.includes('deb packages') || lower.includes('python')) {
    return 'Linux & System';
  }
  if (lower.includes('xss') || lower.includes('wpscan') || lower.includes('nuclei') || lower.includes('vulnerability') || lower.includes('amass') || lower.includes('xsstrike') || lower.includes('vulnclaw')) {
    return 'Web & Vulnerability Scanning';
  }
  if (lower.includes('wifi') || lower.includes('evil twin') || lower.includes('fluxion') || lower.includes('camera') || lower.includes('camphish') || lower.includes('evilnovnc') || lower.includes('session')) {
    return 'Network & Wireless Attacks';
  }
  return 'Ethical Hacking & Tools';
}

function parseXMLTags(entryXML) {
  const getTag = (tag) => {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = entryXML.match(regex);
    return match ? match[1].trim() : '';
  };

  const idMatch = entryXML.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/i);
  const videoId = idMatch ? idMatch[1].trim() : '';
  const title = getTag('title');
  const published = getTag('published');
  const descMatch = entryXML.match(/<media:description>([\s\S]*?)<\/media:description>/i);
  const description = descMatch ? descMatch[1].trim() : '';

  return { videoId, title, published, description };
}

function syncYouTubeVideos() {
  console.log(`⚡ Fetching YouTube RSS Feed for Ethical Explorers (${CHANNEL_ID})...`);

  https.get(RSS_URL, (res) => {
    let rawData = '';

    res.on('data', (chunk) => {
      rawData += chunk;
    });

    res.on('end', () => {
      try {
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
        let match;
        const newVideos = [];

        while ((match = entryRegex.exec(rawData)) !== null) {
          const parsed = parseXMLTags(match[1]);
          if (parsed.videoId && parsed.title) {
            const formattedDate = parsed.published ? parsed.published.substring(0, 10) : new Date().toISOString().substring(0, 10);
            newVideos.push({
              id: parsed.videoId,
              title: parsed.title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
              description: parsed.description ? parsed.description.substring(0, 200) + '...' : `Watch this tutorial on Ethical Explorers YouTube channel.`,
              category: categorizeVideo(parsed.title),
              date: formattedDate,
              youtubeUrl: `https://www.youtube.com/watch?v=${parsed.videoId}`
            });
          }
        }

        if (newVideos.length === 0) {
          console.warn('! No videos extracted from RSS feed.');
          return;
        }

        // Load existing videos if available to preserve history
        let existingVideos = [];
        if (fs.existsSync(VIDEOS_PATH)) {
          try {
            existingVideos = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf8'));
          } catch (e) {
            existingVideos = [];
          }
        }

        // Merge keeping the latest videos at top without duplicates
        const videoMap = new Map();
        newVideos.forEach(v => videoMap.set(v.id, v));
        existingVideos.forEach(v => {
          if (!videoMap.has(v.id)) {
            videoMap.set(v.id, v);
          }
        });

        const mergedVideos = Array.from(videoMap.values());

        fs.writeFileSync(VIDEOS_PATH, JSON.stringify(mergedVideos, null, 2), 'utf8');
        console.log(`✅ Successfully synced ${mergedVideos.length} YouTube videos from @ethicalexplorers18 to data/videos.json!`);
      } catch (err) {
        console.error('Error parsing YouTube RSS:', err.message);
      }
    });
  }).on('error', (err) => {
    console.error('Failed to fetch YouTube RSS:', err.message);
  });
}

syncYouTubeVideos();
