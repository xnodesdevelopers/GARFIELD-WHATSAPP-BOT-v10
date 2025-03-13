const { cmd } = require('../command');
const yts = require('yt-search'); // YouTube video search
const axios = require('axios'); // API requests
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// Cache for storing search results and download links
const cache = new Map();

cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube audio using keywords.",
    category: "main",
    use: ".song <title or keywords>",
    filename: __filename,
}, async (_action, _message, _args, { from, q, reply }) => {
    try {
        if (!q) {
            return await reply('*❌ Please provide a video name or link!*');
        }

        // Use cached result if available
        if (cache.has(q)) {
            const { thumbnail, caption, audioUrl } = cache.get(q);
            await Promise.all([
                _action.sendMessage(from, { image: { url: thumbnail }, caption: caption.trim() }, { quoted: _message }),
                _action.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: _message })
            ]);
            return;
        }

        await reply('```🔍 Searching for the Song... 🎵```');

        // Fetch YouTube video details
        const searchResults = await yts(q);
        const video = searchResults.videos[0];
        if (!video) return reply('*❌ No results found! Try different keywords.*');

        const { title, duration, views, author, url: videoUrl, thumbnail } = video;
        const caption = `\n*🎶 Song Name*: ${title}\n🕜 *Duration*: ${duration}\n📻 *Listeners*: ${views}\n🎙️ *Artist*: ${author.name}\n\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1\n> File Name: ${title}.mp3\n        `;

        await _action.sendMessage(from, { image: { url: thumbnail }, caption: caption.trim() }, { quoted: _message });

        const videoId = extractVideoId(videoUrl);
        if (!videoId) return reply('*❌ Invalid YouTube URL.*');

        const audioUrl = await fetchDownloadLink(videoId);
        if (!audioUrl) return reply('*❌ Failed to fetch download link.*');

        // Cache for future requests
        cache.set(q, { thumbnail, caption, audioUrl });

        await _action.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: _message });
    } catch (error) {
        reply('*❌ An unexpected error occurred. Please try again later.*');
    }
});

// Helper: Fetch audio link from API
async function fetchDownloadLink(videoId) {
    const options = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: { id: videoId },
        headers: {
            'X-RapidAPI-Key': '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        },
        timeout: 20000
    };

    const { data } = await axios.request(options);
    return data.status === 'ok' ? data.link : null;
}

// Helper: Extract YouTube video ID
function extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
            }
