const { cmd } = require("../command");
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const STORE_DIR = path.join(__dirname, '..', 'store');
const PYTHON_SCRIPT = path.join(__dirname, '..', 'lib', 'ytdl.py');

// Ensure store directory exists
if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR);
}

// Helper functions
const cleanFilename = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 64);
const downloadMedia = async (url, type, quality = '360') => {
    const input = JSON.stringify({ url, media_type: type, quality });
    
    try {
        const result = execSync(
            `"${process.env.PYTHON_PATH || 'python3'}" "${PYTHON_SCRIPT}" '${input}'`,
            { 
                cwd: STORE_DIR,
                maxBuffer: 50 * 1024 * 1024,
                windowsHide: true 
            }
        ).toString();
        
        const data = JSON.parse(result);
        if (data.success) {
            data.filename = path.join(STORE_DIR, path.basename(data.filename));
        }
        return data;
    } catch (e) {
        return { 
            success: false, 
            error: `Execution failed: ${e.message}` 
        };
    }
};

const searchVideo = async (query) => {
    try {
        const results = await playdl.search(query, { limit: 1 });
        return results[0] || null;
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};

// Song command (128kbps audio)
cmd({
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio (128kbps)",
    category: "media",
    use: "<song name>"
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a song name");

        const video = await searchVideo(query);
        if (!video) return reply("❌ No results found");

      const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
      await conn.sendMessage(from, {
        image: { url: video.thumbnails[0].url }, // Send video thumbnail
        caption: ytmsg, // Send video details
      });

        
        const result = await downloadMedia(
            `https://youtu.be/${video.id}`,
            'audio'
        );

        if (!result.success) {
            console.error('Download failed:', result.error);
            return reply(`❌ Download failed: ${result.error}`);
        }

        await conn.sendMessage(
            from,
            {
                audio: fs.readFileSync(result.filename),
                mimetype: 'audio/mpeg',
                fileName: `${cleanFilename(video.title)}.mp3`
            },
            { quoted: mek }
        );

        fs.unlinkSync(result.filename);
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while processing your request");
    }
});

// Video command (360p)
cmd({
    pattern: "video",
    react: "🎥",
    desc: "Download YouTube video (360p)",
    category: "media",
    use: "<video name>"
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a video name");

        const video = await searchVideo(query);
        if (!video) return reply("❌ No results found");

              const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;
        const result = await downloadMedia(
            `https://youtu.be/${video.id}`,
            'video'
        );

        if (!result.success) {
            console.error('Download failed:', result.error);
            return reply(`❌ Download failed: ${result.error}`);
        }

        await conn.sendMessage(
            from,
            {
                video: fs.readFileSync(result.filename),
                caption: ytmsg,
                mimetype: 'video/mp4'
            },
            { quoted: mek }
        );

        fs.unlinkSync(result.filename);
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while processing your request");
    }
});

// Cleanup on exit
process.on('exit', () => {
    if (fs.existsSync(STORE_DIR)) {
        fs.rmSync(STORE_DIR, { recursive: true, force: true });
    }
});
