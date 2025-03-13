const { cmd } = require('../command'); // Command handler for the bot
const fetch = require('node-fetch'); // For making API requests
const yts = require('yt-search'); // For searching YouTube videos

cmd({
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio using keywords.",
    category: "main",
    use: ".song <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply, conn }) => {
  try {
    // 1. Validate user input
    if (!q || typeof q !== 'string') {
      return await reply('*❌ Please provide a song name or keywords!*');
    }

    // 2. Notify user of search progress
    await reply('```🔍 Searching for the song... 🎶```');

    // 3. Search YouTube using keywords
    const { videos } = await yts(q);
    if (!videos || !videos.length) {
      return reply('*❌ No results found! Try different keywords.*');
    }

    // 4. Extract details of the first video
    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];

    // 5. Create a caption for the response
    const caption = `
*🎶 Song Name*: ${title}
🕜 *Duration*: ${duration}
📻 *Listeners*: ${views}
🎙️ *Artist*: ${author.name}

> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1
> File Name: ${title}.mp3
    `;

    // 6. Send the thumbnail with the caption
    await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption: caption.trim()
    }, { quoted: _message });

    // 7. Fetch audio download link using RapidAPI
    const videoId = extractVideoId(videoUrl);
    const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8', // Replace with your actual API key
        'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
      }
    };

    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      return reply('*❌ Failed to fetch the audio. Please try again later.*');
    }

    const result = await response.json();
    if (result.status !== 'ok' || !result.link) {
      return reply('*❌ Audio unavailable. Please try a different video.*');
    }

    // 8. Send the audio file
    await _action.sendMessage(from, {
      audio: { url: result.link },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: _message });

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
