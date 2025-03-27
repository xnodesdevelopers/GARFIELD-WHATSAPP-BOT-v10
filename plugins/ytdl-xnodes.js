const { cmd } = require("../command");
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const STORE_DIR = path.join(__dirname, "../lib/store");
const PYTHON_PATH = process.platform === 'win32' ? 'python' : 'python3';
const PYTHON_SCRIPT = path.join(__dirname, "../lib/ytdl.py");

// Ensure store directory exists
try {
    if (!fs.existsSync(STORE_DIR)) {
        fs.mkdirSync(STORE_DIR, { recursive: true });
    }
} catch (err) {
    console.error(`Failed to create store directory: ${err.message}`);
    process.exit(1);
}

// Helper functions
const cleanFilename = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_');

const downloadMedia = async (url, type, quality) => {
    try {
        const result = execSync(
            `${PYTHON_PATH} "${PYTHON_SCRIPT}" "${url}" "${type}" "${quality}" "${STORE_DIR}"`,
            { maxBuffer: 50 * 1024 * 1024 }
        ).toString();
        return JSON.parse(result);
    } catch (e) {
        return { success: false, error: e.message };
    }
};

const searchVideo = async (query) => {
    try {
        const results = await playdl.search(query, { limit: 5 });
        return results[0];
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};

cmd(
    {
        pattern: "song",
        react: "🎶",
        desc: "Download YouTube audio",
        category: "main",
        use: ".song <query>",
        filename: __filename
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const query = args.join(' ');
            if (!query) return reply("Please provide a search query");
            
            const video = await searchVideo(query);
            if (!video) return reply("No results found");

            const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}`;
            
            await conn.sendMessage(from, {
                image: { url: video.thumbnails[0].url },
                caption: ytmsg,
            });

            const result = await downloadMedia(
                `https://youtu.be/${video.id}`,
                'audio',
                '360'
            );
            
            if (!result.success) {
                return reply(`❌ Download failed: ${result.error}`);
            }
            
            const stats = fs.statSync(result.filename);
            if (stats.size === 0) {
                fs.unlinkSync(result.filename);
                return reply("❌ Downloaded file is empty");
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
            reply("❌ An error occurred");
        }
    }
);

cmd(
    {
        pattern: "video",
        react: "🎥",
        desc: "Download YouTube video",
        category: "main",
        use: ".video <query>",
        filename: __filename
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const query = args.join(' ');
            if (!query) return reply("Please provide a search query");
            
            const video = await searchVideo(query);
            if (!video) return reply("No results found");
            
            const result = await downloadMedia(
                `https://youtu.be/${video.id}`,
                'video',
                '720'
            );
            
            if (!result.success) {
                return reply(`❌ Download failed: ${result.error}`);
            }
            
            const stats = fs.statSync(result.filename);
            if (stats.size === 0) {
                fs.unlinkSync(result.filename);
                return reply("❌ Downloaded file is empty");
            }
            
            const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}`;
            
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
            reply("❌ An error occurred");
        }
    }
);

process.on('exit', () => {
    try {
        if (fs.existsSync(STORE_DIR)) {
            fs.rmSync(STORE_DIR, { recursive: true, force: true });
        }
    } catch (err) {
        console.error(`Failed to remove store directory: ${err.message}`);
    }
});

module.exports = {
    downloadMedia,
    searchVideo
};
