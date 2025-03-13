const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const axios = require('axios'); // For API requests
const fs = require('fs'); // For file system operations
const path = require('path'); // For path manipulation

cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube audio using keywords or a direct URL.",
    category: "main",
    use: ".song <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) {
      return await reply('*❌ Please provide a video name, keywords, or a YouTube URL!*');
    }

    // Notify user of search progress
    await reply('```🔍 Searching for the song... 🎵```');

    let videoUrl = q;

    // If the input is not a URL, search YouTube for the video
    if (!q.includes('youtube.com/watch') && !q.includes('youtu.be/')) {
      const searchResults = await yts(q);
      const videos = searchResults.videos;

      if (!videos || !videos.length) {
        return reply('*❌ No results found! Try different keywords.*');
      }

      videoUrl = videos[0].url; // Use the first search result's URL
    }

    // Extract video ID from the URL
    const videoId = extractVideoId(videoUrl);

    // Fetch video details (title, thumbnail, etc.) from yt-search
    const searchResults = await yts({ videoId });
    const videoDetails = searchResults.videos[0];

    if (!videoDetails) {
      return reply('*❌ Failed to fetch video details. Please try again later.*');
    }

    const { title, thumbnail, duration, views, author } = videoDetails;

    // Send thumbnail with caption
    await _action.sendMessage(from, {
      image: { url: thumbnail },
      caption: `🎶 *Title:* ${title}\n🕜 *Duration:* ${duration}\n👁️ *Views:* ${views}\n👤 *Artist:* ${author.name}\n\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1`
    }, { quoted: _message });

    // Fetch audio download link using RapidAPI
    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'X-RapidAPI-Key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8', // Replace with your actual API key
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    if (response.data.status !== 'ok') {
      return reply('*❌ Failed to fetch the audio. Please try again later.*');
    }

    // Notify user of download progress
    await reply('```⬇️ Downloading the song... 🎶```');

    // Download the MP3 file
    const mp3Response = await axios({
      method: 'GET',
      url: response.data.link,
      responseType: 'stream'
    });

    // Create a safe filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${safeTitle}.mp3`;
    const filePath = path.join(__dirname, fileName);

    // Save the file to disk
    const writer = fs.createWriteStream(filePath);
    mp3Response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Send the audio file to the user
    await _action.sendMessage(from, {
      audio: fs.readFileSync(filePath),
      mimetype: 'audio/mpeg',
      caption: `🎶 *Title:* ${title}\n🕜 *Duration:* ${duration}\n👁️ *Views:* ${views}\n👤 *Artist:* ${author.name}\n\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1`
    }, { quoted: _message });

    // Delete the file after sending
    fs.unlinkSync(filePath);

  } catch (error) {
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
