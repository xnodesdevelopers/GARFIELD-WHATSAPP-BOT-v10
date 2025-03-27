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
if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
}

const cleanFilename = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_');

const downloadMedia = async (url, type) => {
    try {
        const result = execSync(
            `"${PYTHON_PATH}" "${PYTHON_SCRIPT}" "${url}" "${type}" "${STORE_DIR}"`,
            { maxBuffer: 100 * 1024 * 1024 }
        ).toString();
        return JSON.parse(result);
    } catch (e) {
        return { 
            success: false, 
            error: e.message,
            type: 'execution_error'
        };
    }
};

// Audio Command
cmd(
    {
        pattern: "song",
        react: "🎶",
        desc: "Download audio (m4a format)",
        category: "media",
        use: ".song <query/url>"
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const input = args.join(' ');
            if (!input) return reply("Provide search query or YouTube URL");

            let video;
            if (input.match(/youtu\.?be/)) {
                const videoId = input.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
                if (!videoId) return reply("Invalid URL");
                video = { id: videoId };
            } else {
                const results = await playdl.search(input, { limit: 1 });
                if (!results.length) return reply("No results found");
                video = results[0];
            }

            const result = await downloadMedia(`https://youtu.be/${video.id}`, 'audio');
            
            if (!result.success) return reply(`❌ Failed: ${result.error}`);
      const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
      await conn.sendMessage(from, {
        image: { url: video.thumbnails[0].url }, // Send video thumbnail
        caption: ytmsg, // Send video details
      });



            await conn.sendMessage(
                from,
                {
                    audio: fs.readFileSync(result.filename),
                    mimetype: 'audio/mp4',
                    fileName: `${cleanFilename(result.title)}.m4a`
                },
                { quoted: mek }
            );

            fs.unlinkSync(result.filename);
        } catch (e) {
            console.error(e);
            reply("❌ Audio download error");
        }
    }
);

// Video Command (360p)
cmd(
    {
        pattern: "video",
        react: "🎬",
        desc: "Download video (360p)",
        category: "media",
        use: ".video <query/url>"
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const input = args.join(' ');
            if (!input) return reply("Provide search query or YouTube URL");

            let video;
            if (input.match(/youtu\.?be/)) {
                const videoId = input.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
                if (!videoId) return reply("Invalid URL");
                video = { id: videoId };
            } else {
                const results = await playdl.search(input, { limit: 1 });
                if (!results.length) return reply("No results found");
                video = results[0];
            }

                 const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;


            const result = await downloadMedia(`https://youtu.be/${video.id}`, 'video');
            
            if (!result.success) return reply(`❌ Failed: ${result.error}`);

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
            reply("❌ Video download error");
        }
    }
);
