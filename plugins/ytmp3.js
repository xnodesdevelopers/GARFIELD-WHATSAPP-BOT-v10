const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const axios = require('axios'); // API requests
const { promisify } = require('util');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const pipeline = promisify(stream.pipeline);

// Define destination folder for downloads
const destinationFolder = './Downloads';

// Ensure the downloads directory exists
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true });
}

// Cache for storing search results and download links
const cache = new Map();

cmd({
  pattern: "song",
  react: "🎵",
  desc: "Download YouTube audio using keywords.",
  category: "main",
  use: ".song <title or keywords>",
  filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) {
      return await reply('*❌ Please provide a video name or link!*');
    }

    // Check cache for existing results
    if (cache.has(q)) {
      const { thumbnail, caption, audioUrl } = cache.get(q);
      await _action.sendMessage(from, { image: { url: thumbnail }, caption: caption.trim() }, { quoted: _message });
      await _action.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: _message });
      return;
    }

    // Notify user of search progress
    await reply('```🔍 Searching for the Song... 🎵```');

    // Fetch search results and extract details of the first result
    const searchResults = await yts(q);
    const videos = searchResults.videos;

    if (!videos || !videos.length) {
      return reply('*❌ No results found! Try different keywords.*');
    }

    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];

    // Create a caption for the response
    const caption = `*🎶 Song Name*: ${title}\n🕜 *Duration*: ${duration}\n📻 *Listeners*: ${views}\n🎙️ *Artist*: ${author.name}\n\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1\n> File Name: ${title}.mp3`;

    // Send the thumbnail with the caption
    await _action.sendMessage(from, {
      image: { url: thumbnail },
      caption: caption.trim()
    }, { quoted: _message });

    // Fetch audio download link using RapidAPI
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return reply('*❌ Could not extract video ID. Please provide a valid link or title.*');
    }

    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'X-RapidAPI-Key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
      timeout: 30000, // Set timeout to 10 seconds
    };

    // Get download link from API
    const response = await axios.request(options);

    if (response.data.status !== 'ok') {
      return reply(`*❌ API Error: ${response.data.msg || 'Failed to get download link'}*`);
    }

    const audioUrl = response.data.link;

    // Cache the results for future use
    cache.set(q, { thumbnail, caption, audioUrl });

    // Send the audio file
    await _action.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg'
    }, { quoted: _message });

  } catch (error) {
    console.error('Error in song command:', error);
    reply('*❌ An unexpected error occurred. Please try again later.*');
  }
});

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  let videoId = '';
  
  try {
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else {
      // If it's not a URL, assume it's already a video ID
      // This handles cases where the video ID is extracted from search results
      videoId = url;
    }
  } catch (error) {
    console.error('Error extracting video ID:', error);
  }
  
  return videoId;
    }
