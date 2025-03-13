const { cmd } = require('../command'); // Command handler for the bot
const yts = require('yt-search'); // For searching YouTube videos
const axios = require('axios'); // For making API requests

cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube audio as MP3.",
    category: "main",
    use: ".mp3 <YouTube URL or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) {
      return await reply('*❌ Please provide a YouTube URL or keywords!*');
    }

    // Notify user of search progress
    await reply('```🔍 Searching for the video...```');

    // Extract video URL or search for video using keywords
    let videoUrl = q;
    let videoDetails = null;

    if (!q.includes('youtube.com/watch') && !q.includes('youtu.be/')) {
      // Search YouTube using keywords
      const searchResults = await yts(q);
      const videos = searchResults.videos;

      if (!videos || !videos.length) {
        return reply('*❌ No results found! Try different keywords.*');
      }

      videoDetails = videos[0]; // Use the first result's details
      videoUrl = videoDetails.url;
    } else {
      // Fetch video details using yt-search
      const videoInfo = await yts({ videoId: extractVideoId(q) });
      videoDetails = videoInfo;
    }

    // Extract video details
    const { title, duration, views, author, thumbnail } = videoDetails;

    // Create a caption for the response
    const caption = `
*🎶 Song Name*: ${title}
🕜 *Duration*: ${duration}
📻 *Views*: ${views}
🎙️ *Artist*: ${author.name}

> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1
> File Name: ${title}.mp3
    `;

    // Send the thumbnail with the caption
    await _action.sendMessage(from, {
      image: { url: thumbnail },
      caption: caption.trim()
    }, { quoted: _message });

    // Notify user of download progress
    await reply('```⬇️ Downloading audio...```');

    // Fetch MP3 download link using RapidAPI
    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: extractVideoId(videoUrl) },
      headers: {
        'X-RapidAPI-Key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8', // Replace with your actual API key
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    if (response.data.status === 'ok') {
      const { link } = response.data;

      // Send the audio file
      await _action.sendMessage(from, {
        audio: { url: link },
        mimetype: 'audio/mpeg',
        filename: `${title}.mp3`
      }, { quoted: _message });

      await reply('*✅ Audio downloaded successfully!*');
    } else {
      throw new Error(response.data.msg || 'Failed to get download link');
    }
  } catch (error) {
    console.error('Error:', error.message);
    reply('*❌ An error occurred. Please try again later.*');
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
