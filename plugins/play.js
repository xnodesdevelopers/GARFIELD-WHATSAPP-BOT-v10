const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const fetch = require('node-fetch'); // API requests

cmd({
    pattern: "play",
    react: "🎵",
    desc: "Download YouTube audio using keywords.",
    category: "main",
    use: ".play <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) return await reply('*Please provide a video name or link!*');

    // Notify user of search progress
    
    await reply('```Downloading Song 🎵⬇️```');

    // Fetch search results
    const { videos } = await yts(q);
    if (!videos.length) return reply('*No results found! Try different keywords.*');

    // Extract details of the first result
    const { title, duration, views, author, url: videoUrl } = videos[0];

    // Creative caption
    const caption = `
*🎶 Song Name* - ${title}
🕜 *Duration* - ${duration}
📻 *Listeners* - ${views}
🎙️ *Artist* - ${author.name}

> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 �𝖡𝖮Т v10.1
> File Name: ${title}.mp3
    `;

    // Fetch audio download link with a timeout
    const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`);
    const { success, result } = await apiResponse.json();

    if (!apiResponse.ok || !success || !result?.downloadUrl) {
      return reply('*Failed to fetch the audio. Please try again later.*');
    }

    // Send audio and metadata
    await _action.sendMessage(from, {
      document: { url: result.downloadUrl },
      mimetype: 'audio/mpeg',
      caption: caption.trim()
    }, { quoted: _message });

  } catch (error) {
    console.error('Error:', error);
    reply('*❌ An unexpected error occurred. Please try again later.*');
  }
});
