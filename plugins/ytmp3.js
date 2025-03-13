const { cmd } = require('../command');
const yts = require('yt-search'); // For YouTube video search
const fetch = require('node-fetch'); // For API requests

cmd({
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio via keywords.",
    category: "main",
    use: ".audio <song name or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) return await reply('*Please provide song name or keywords!*');

    // Inform user of search progress
    reply('```🔍 Searching for audio... 🎶```');

    // Fetch search results
    const { videos } = await yts(q);
    if (!videos.length) return reply('*No results found! Please try again with different keywords.*');

    // Extract first video details
    const { title, duration, views, author, url: videoUrl, thumbnail } = videos[0];
    const ytmsg = `*🎶 Song Name:* ${title}\n*🕜 Duration:* ${duration}\n*📻 Listeners:* ${views}\n*🎙️ Artist:* ${author.name}\n> Filename: ${title}.mp3`;

    // Generate audio download URL
    const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`);
    const { success, result } = await apiResponse.json();

    if (!apiResponse.ok || !success || !result?.download_url) {
      return reply('*Failed to fetch the audio. Try again later.*');
    }

    // Concurrently send thumbnail and audio file
    await Promise.all([
      conn.sendMessage(from, { image: { url: thumbnail }, caption: ytmsg }),
      _action.sendMessage(from, {
        audio: { url: result.download_url },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: _message })
    ]);

  } catch (error) {
    console.error('Error:', error);
    reply('*❌ Something went wrong. Please try again later.*');
  }
});
