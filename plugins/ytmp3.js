const { cmd } = require('../command');
const yts = require('yt-search'); // For searching YouTube videos
const fetch = require('node-fetch'); // For API requests

cmd({   
    pattern: "song",
    react: "🎶",
    desc: "Quickly download YouTube audio by searching for keywords.",
    category: "main",
    use: ".audio <song name or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    if (!q) return await reply('*Enter Here*');

    // Step 1: Search for videos using yt-search
    reply('```🔍 Searching for the audio... 🎶```');
    const searchResults = await yts(q);
    if (!searchResults.videos.length) return reply('No results found!');

    const { title, duration, views, author, url: videoUrl, thumbnail } = searchResults.videos[0];
      const ytmsg = `*🎶 Song Name* - ${title}\n*🕜 Duration* - ${duration}\n*📻 Listeners* - ${views}\n*🎙️ Artist* - ${author.name}\n> File Name ${title}.mp3`;

    // Step 2: Fetch audio download link from the API
    const audioUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(audioUrl);
    const result = await response.json();

    if (response.status !== 200 || !result.success || !result.result.download_url) {
      return reply('Failed to fetch the audio. Please try again later.');
    }

    // Send thumbnail and audio concurrently
    await Promise.all([
      conn.sendMessage(from, { image: { url: thumbnail }, caption: ytmsg }),
      _action.sendMessage(from, {
        audio: { url: result.result.download_url },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: _message })
    ]);
  } catch (error) {
    console.error(error);
    reply('❌ An error occurred. Please try again later.');
  }
});
