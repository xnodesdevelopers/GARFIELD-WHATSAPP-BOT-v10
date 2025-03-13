const { cmd } = require('../command');
const yts = require('yt-search'); // For searching YouTube videos
const fetch = require('node-fetch'); // For API requests

cmd({   
    pattern: "video",
    react: "📹",
    desc: "Quickly download YouTube audio by searching for keywords.",
    category: "main",
    use: ".audio <song name or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    if (!q) return await reply('*Enter Name or Link*');

 for videos using yt-search
    reply('```🔍 Searching for the video... 🎥```');
    const searchResults = await yts(q);
    if (!searchResults.videos.length) return reply('No results found!');

    const { title, duration, views, author, url: videoUrl, thumbnail } = searchResults.videos[0];

    // Step 2: Fetch video download link from the API
    const videoUrlx = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(videoUrlx);
    const result = await response.json();

    if (response.status !== 200 || !result.success || !result.result.download_url) {
      return reply('Failed to fetch the video. Please try again later.');
    }

    // Step 3: Prepare metadata and caption
    const ytmsg = `🎬 *Title* - ${title}\n🕜 *Duration* - ${duration}\n👁️ *Views* - ${views}\n👤 *Author* - ${author.name}\n🔗 *Link* - ${videoUrl}`;

    // Step 4: Send the video and metadata concurrently
    await Promise.all([
      _action.sendMessage(from, {
        video: { url: result.result.download_url },
        mimetype: 'video/mp4',
        caption: ytmsg
      }, { quoted: _message })
    ]);


  } catch (error) {
    console.error(error);
    reply('❌ An error occurred. Please try again later.');
  }
});
