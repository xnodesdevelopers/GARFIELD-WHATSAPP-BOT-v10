const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const fetch = require('node-fetch'); // API requests

cmd({
    pattern: "video",
    react: "⬇️",
    desc: "Download YouTube video using keywords.",
    category: "main",
    use: ".video <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) return await reply('*Please provide a video name or link!*');

    // Notify user of search progress
    reply('```🔍 Searching for the video... 🎥```');

    // Fetch search results
    const { videos } = await yts(q);
    if (!videos.length) return reply('*No results found! Try different keywords.*');

    // Extract details of the first result
    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];

    const ytmsg = `🎬 *Title:* ${title}\n🕜 *Duration:* ${duration}\n👁️ *Views:* ${views}\n👤 *Author:* ${author.name}\n🔗 *Link:* ${videoUrl}`;

    // Fetch video download link
    const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`);
    const { success, result } = await apiResponse.json();

    if (!apiResponse.ok || !success || !result?.download_url) {
      return reply('*Failed to fetch the video. Please try again later.*');
    }

    // Send video and metadata concurrently
    await Promise.all([
      _action.sendMessage(from, {
        video: { url: result.download_url },
        mimetype: 'video/mp4',
        caption: ytmsg
      }, { quoted: _message })
    ]);

  } catch (error) {
    console.error('Error:', error);
    reply('*❌ An unexpected error occurred. Please try again later.*');
  }
});
