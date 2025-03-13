const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const axios = require('axios'); // API requests
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

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
      return reply('*❌ Invalid YouTube URL. Please provide a valid link.*');
    }

    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'X-RapidAPI-Key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8', // Use API key from .env file
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
      timeout: 10000, // Set timeout to 10 seconds
    };

    // Get download link from API
    const response = await axios.request(options);

    if (response.data.status === 'ok') {
      const mp3Response = await axios({
        method: 'GET',
        url: response.data.link,
        responseType: 'stream',
      });

      // Create safe filename
      const safeTitle = response.data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${safeTitle}.mp3`;
      const filePath = path.join(destinationFolder, fileName);

      // Save file to disk using pipeline
      const writer = fs.createWriteStream(filePath);
      await pipeline(mp3Response.data, writer);

      return filePath;
    } else {
      throw new Error(response.data.msg || 'Failed to get download link');
    }

    // Cache the results for future use
    cache.set(q, { thumbnail, caption, audioUrl: jsonResponse.link });

    // Send the audio file
    await _action.sendMessage(from, {
      audio: { url: jsonResponse.link },
      mimetype: 'audio/mpeg'
    }, { quoted: _message });

  } catch (error) {
    // Notify the user
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
