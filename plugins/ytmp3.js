const { cmd } = require('../command');
const axios = require('axios'); // API requests
const yts = require('yt-search'); // YouTube search functionality

// Configure Axios for better performance
const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Connection': 'keep-alive',
  },
  http2: true, // Enable HTTP/2
});

cmd({
  pattern: "song",
  react: "🎶",
  desc: "Download YouTube songs based on keywords.",
  category: "main",
  use: ".audio <song name or keywords>",
  filename: __filename,
}, async (_action, _message, _args, { from, q, reply, conn }) => {
  try {
    // Ensure user input is valid
    if (!q || typeof q !== 'string') {
      return await reply('*Please provide a song name or keywords!*');
    }

    reply('```🔍 Searching and Processing... 🎶```');

    // Perform parallel operations: YouTube search + Initial thumbnail preparation
    const { videos } = await yts(q);
    if (!videos || !videos.length) {
      return reply('*No results found! Try different keywords.*');
    }

    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];

    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`;

    // Fetch API response and send thumbnail in parallel
    const [apiResponse, thumbnailSend] = await Promise.all([
      axiosInstance.get(apiUrl).catch(async (error) => {
        console.error('API request failed:', error);
        throw new Error('API request failed');
      }),
      conn.sendMessage(from, { 
        image: { url: thumbnail },
        caption: `*🎶 Song Name* - ${title}
🕜 *Duration* - ${duration}
📻 *Listeners* - ${views}
🎙️ *Artist* - ${author}
> **GΛRFIELD BOTv10.1**
> File Name: ${title}.mp3`
      })
    ]);

    if (apiResponse.status !== 200 || !apiResponse.data.success || !apiResponse.data.result?.downloadUrl) {
      return reply('*API ERROR: Audio unavailable.*');
    }

    const { downloadUrl } = apiResponse.data.result;

    // Send the audio file
    await _action.sendMessage(from, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: _message });

  } catch (error) {
    console.error('Error occurred:', error);
    reply('*❌ An unexpected error occurred! Please try again later.*');
  }
});
