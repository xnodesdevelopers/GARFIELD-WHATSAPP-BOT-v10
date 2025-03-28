const { cmd } = require("../command");
const { exec } = require('child_process');
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

const downloadMedia = (url, type) => {
    return new Promise((resolve) => {
        exec(
            `"${PYTHON_PATH}" "${PYTHON_SCRIPT}" "${url}" "${type}" "${STORE_DIR}"`,
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
                    resolve(JSON.parse(stdout));
                } catch (e) {
                    resolve({
                        success: false,
                        error: 'Failed to parse response',
                        type: 'parse_error'
                    });
                }
            }
        );
    });
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

            // Get video info in parallel with loading message
            const [loadingMsg, video] = await Promise.all([
                
                (async () => {
                    if (input.match(/youtu\.?be/)) {
                        const videoId = input.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
                        if (!videoId) throw new Error("Invalid URL");
                        return { id: videoId };
                    } else {
                        const results = await playdl.search(input, { limit: 1 });
                        if (!results.length) throw new Error("No results found");
                        return results[0];
                    }
                })()
            ]);

            const result = await downloadMedia(`https://youtu.be/${video.id}`, 'audio');
            
            if (!result.success) {
                await conn.sendMessage(from, { 
                    text: `❌ Failed: ${result.error}`,
                    delete: loadingMsg.key
                }, { quoted: mek });
                return;
            }

            const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
            
            // Send thumbnail and details first
            await conn.sendMessage(from, {
                image: { url: video.thumbnails[0].url },
                caption: ytmsg
            });

            // Send audio file
            await conn.sendMessage(
                from,
                {
                    audio: fs.readFileSync(result.filename),
                    mimetype: 'audio/mp4',
                    fileName: `${cleanFilename(video.title)}.m4a`
                },
                { quoted: mek }
            );

            // Clean up
            fs.unlinkSync(result.filename);
            await conn.sendMessage(from, { 
                delete: loadingMsg.key 
            });

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
            const input = args.join(' ').trim();
            if (!input) return reply("Provide search query or YouTube URL");

            // Get video info in parallel with loading message
            const [loadingMsg, video] = await Promise.all([
                
                (async () => {
                    if (input.match(/youtu\.?be/)) {
                        const videoId = input.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
                        if (!videoId) throw new Error("Invalid URL");
                        return { id: videoId };
                    } else {
                        const results = await playdl.search(input, { limit: 1 });
                        if (!results.length) throw new Error("No results found");
                        return results[0];
                    }
                })()
            ]);

            const result = await downloadMedia(`https://youtu.be/${video.id}`, 'video');
            
            if (!result.success) {
                await conn.sendMessage(from, { 
                    text: `❌ Failed: ${result.error}`,
                    delete: loadingMsg.key
                }, { quoted: mek });
                return;
            }

            const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;
            
            // Send video with caption
            await conn.sendMessage(
                from,
                {
                    video: fs.readFileSync(result.filename),
                    caption: ytmsg,
                    mimetype: 'video/mp4'
                },
                { quoted: mek }
            );

            // Clean up
            fs.unlinkSync(result.filename);
            await conn.sendMessage(from, { 
                delete: loadingMsg.key 
            });

        } catch (e) {
            console.error(e);
            reply("❌ Video download error");
        }
    }
);
