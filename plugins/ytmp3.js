const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const fetch = require('node-fetch'); // API requests
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
require('dotenv').config();

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
    const caption = `
*🎶 Song Name*: ${title}
🕜 *Duration*: ${duration}
📻 *Listeners*: ${views}
🎙️ *Artist*: ${author.name}

> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1
> File Name: ${title}.mp3
    `;

    // Send the thumbnail with the caption
    await _action.sendMessage(from, { 
      image: { url: thumbnail }, 
      caption: caption.trim() 
    }, { quoted: _message });

    // Fetch audio download link using RapidAPI
    const apiResponse = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${extractVideoId(videoUrl)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8', // Use API key from .env file
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    });

    const jsonResponse = await apiResponse.json();

    // Validate the API response
    if (!apiResponse.ok || jsonResponse.status !== 'ok' || !jsonResponse.link) {
      return reply('*❌ Failed to fetch the audio. Please try again later.*');
    }

    // Cache the results for future use
    cache.set(q, { thumbnail, caption, audioUrl: jsonResponse.link });

    // Send the audio file
    await _action.sendMessage(from, {
      audio: { url: jsonResponse.link },
      mimetype: 'audio/mpeg'
    }, { quoted: _message });

  } catch (error) {
    // Log the error and notify the user
    console.error('Error:', error.message);
    reply('*❌ An unexpected error occurred. Please try again later.*');
  }
});

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  let videoId = '';

  if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get('v');
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }

  return videoId;
      }
