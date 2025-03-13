const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const fetch = require('node-fetch'); // API requests

cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube audio using keywords.",
    category: "main",
    use: ".song <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply, conn }) => {
  try {
    // Validate input
    if (!q) return await reply('*Please provide a video name or link!*');

    // Notify user of search progress
    await reply('```🔍 Searching for the Song... 🎵```');

    // Fetch search results and extract details of the first result
    const { videos } = await yts(q);
    if (!videos.length) return reply('*No results found! Try different keywords.*');
    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];

    // Creative caption
    const caption = `
*🎶 Song Name* - ${title}
🕜 *Duration* - ${duration}
📻 *Listeners* - ${views}
🎙️ *Artist* - ${author.name}

> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1
> File Name: ${title}.mp3
    `;

    // Send thumbnail with caption
    await conn.sendMessage(from, { image: { url: thumbnail }, caption: caption.trim() }, { quoted: _message });

    // Fetch audio download link
    const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`);
    const { success, result } = await apiResponse.json();

    if (!apiResponse.ok || !success || !result?.downloadUrl) {
      return reply('*Failed to fetch the audio. Please try again later.*');
    }

    // Send audio file
    await conn.sendMessage(from, {
      audio: { url: result.downloadUrl },
      mimetype: 'audio/mpeg',
      caption: caption.trim()
    }, { quoted: _message });

  } catch (error) {
    console.error('Error:', error);
    reply('*❌ An unexpected error occurred. Please try again later.*');
  }
});
