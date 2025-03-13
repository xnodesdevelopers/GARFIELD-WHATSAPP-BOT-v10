const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const fetch = require('node-fetch'); // API requests

cmd({
    pattern: "audio",
    react: "🎵",
    desc: "Download YouTube audio using keywords.",
    category: "main",
    use: ".audio <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) return await reply('*Please provide a video name or link!*');

    // Notify user of search progress
    await reply('```🔍 Searching for the audio... 🎵```');

    // Fetch search results
    const { videos } = await yts(q);
    if (!videos.length) return reply('*No results found! Try different keywords.*');

    // Extract details of the first result
    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];

    const audioInfo = `*🎶 Song Name* - ${title}\n🕜 *Duration* - ${duration}\n📻 *Listerners* - ${views}\n *🎙️ Artist* - ${author}\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Тv10.1\n> File Name ${title}.mp3`;

    // Fetch audio download link with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`, {
      signal: controller.signal,
    });

    clearTimeout(timeout); // Clear the timeout if the request completes

    const { success, result } = await apiResponse.json();

    if (!apiResponse.ok || !success || !result?.downloadUrl) {
      return reply('*Failed to fetch the audio. Please try again later.*');
    }

    // Send audio and metadata concurrently
    await Promise.all([
      _action.sendMessage(from, {
        audio: { url: result.downloadUrl },
        mimetype: 'audio/mpeg',
        caption: audioInfo
      }, { quoted: _message })
    ]);

  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'AbortError') {
      reply('*❌ Request timed out. Please try again later.*');
    } else {
      reply('*❌ An unexpected error occurred. Please try again later.*');
    }
  }
});
