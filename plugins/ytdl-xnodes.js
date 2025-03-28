const { cmd } = require("../command");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const STORE_DIR = path.join(__dirname, "../lib/store");
const PYTHON_PATH = process.platform === 'win32' ? 'python' : 'python3';
const PYTHON_SCRIPT = path.join(__dirname, "../lib/ytdl.py");
const COOKIES_FILE = path.join(__dirname, "../lib/cookies.txt");

// Ensure directories exist

const cleanFilename = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 64);

const downloadMedia = (url, type) => {
    return new Promise((resolve) => {
        let command = `"${PYTHON_PATH}" "${PYTHON_SCRIPT}" "${url}" "${type}" "${STORE_DIR}"`;
        
        if (fs.existsSync(COOKIES_FILE)) {
            command += ` "${COOKIES_FILE}"`;
        }
        
        exec(
            command,
            { maxBuffer: 100 * 1024 * 1024 },
            (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        success: false,
                        error: stderr || error.message,
                        type: 'execution_error'
                    });
                    return;
                }
                
                try {
                    const result = JSON.parse(stdout);
                    if (result.success && result.filename) {
                        result.filename = path.resolve(result.filename);
                    }
                    resolve(result);
                } catch (e) {
                    resolve({
                        success: false,
                        error: `Failed to parse response: ${stdout || 'No output'}`,
                        type: 'parse_error'
                    });
                }
            }
        );
    });
};

const extractVideoInfo = async (input) => {
    try {
        let videoInfo;
        const youtubeUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const urlMatch = input.match(youtubeUrlRegex);

        if (urlMatch) {
            // Direct YouTube URL
            const videoId = urlMatch[1];
            videoInfo = await playdl.video_info(`https://youtu.be/${videoId}`);
        } else {
            // Search query
            const results = await playdl.search(input, { limit: 1 });
            if (!results.length) {
                throw new Error("No results found");
            }
            videoInfo = await playdl.video_info(results[0].url);
        }

        return videoInfo.video_details;
    } catch (error) {
        console.error("Video info extraction error:", error);
        return null;
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
            const input = args.join(' ').trim();
            if (!input) return reply("Provide search query or YouTube URL");

            const video = await extractVideoInfo(input);
            if (!video) return reply("❌ Failed to extract video information");

            const result = await downloadMedia(video.url, 'audio');
            if (!result.success) return reply(`❌ Failed: ${result.error}`);

            const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;

            await conn.sendMessage(from, {
                image: { url: video.thumbnails[0].url },
                caption: ytmsg
            });

            await conn.sendMessage(
                from,
                {
                    audio: fs.readFileSync(result.filename),
                    mimetype: 'audio/mp4',
                    fileName: `${cleanFilename(video.title)}.m4a`
                },
                { quoted: mek }
            );

            fs.unlinkSync(result.filename);
        } catch (e) {
            console.error(e);
            reply("❌ Audio download error: " + e.message);
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
            const input = args.join(' ').trim();
            if (!input) return reply("Provide search query or YouTube URL");

            const video = await extractVideoInfo(input);
            if (!video) return reply("❌ Failed to extract video information");

            const result = await downloadMedia(video.url, 'video');
            if (!result.success) return reply(`❌ Failed: ${result.error}`);

            const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;

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
            reply("❌ Video download error: " + e.message);
        }
    }
);
