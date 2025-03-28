const { cmd } = require("../command");
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const PYTHON_PATH = process.platform === 'win32' ? 'python' : 'python3';
const PYTHON_SCRIPT = path.join(__dirname, "../lib/ytdl.py");

// Helper functions
const cleanFilename = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_');

const downloadMedia = async (url, type) => {
    try {
        const args = [PYTHON_SCRIPT, url, type];
        const rawOutput = execFileSync(PYTHON_PATH, args, { maxBuffer: 50 * 1024 * 1024 }).toString().trim();
        console.log(`Raw Python output: ${rawOutput}`); // Debug

        let result;
        try {
            result = JSON.parse(rawOutput);
        } catch (jsonError) {
            console.error(`JSON parse error: ${jsonError.message}`);
            const possibleFile = rawOutput.match(/\/root\/GARFIELD-WHATSAPP-BOT-v10\/lib\/store\/[^\s]+\.(m4a|mp4)/)?.[0];
            if (possibleFile && fs.existsSync(possibleFile)) {
                console.log(`File found despite JSON error: ${possibleFile}`);
                return {
                    success: true,
                    filename: possibleFile,
                    title: 'Unknown (JSON parse failed)',
                    duration: 0
                };
            }
            return { success: false, error: `Invalid JSON output: ${rawOutput}` };
        }
        return result;
    } catch (e) {
        console.error('Python execution error:', e);
        return { success: false, error: `Python execution failed: ${e.message}` };
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

// Song command (M4A)
cmd({
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio (fast and playable)",
    category: "main",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a search query");

        const video = await searchVideo(query);
        if (!video) return reply("No results found");

        await reply(`⬇️ Downloading audio: ${video.title}`);

        const result = await downloadMedia(`https://youtu.be/${video.id}`, 'audio');

        if (!result.success) {
            return reply(`❌ Download failed: ${result.error}`);
        }

        const stats = fs.statSync(result.filename);
        if (stats.size === 0) {
            fs.unlinkSync(result.filename);
            return reply("❌ Downloaded file is empty");
        }

        await conn.sendMessage(from, {
            audio: fs.readFileSync(result.filename),
            mimetype: 'audio/mp4',
            fileName: `${cleanFilename(result.title)}.m4a`
        }, { quoted: mek });

        fs.unlinkSync(result.filename);
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while processing the audio");
    }
});

// Video command (360p)
cmd({
    pattern: "video",
    react: "🎥",
    desc: "Download YouTube video (360p highest quality)",
    category: "main",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a search query");

        const video = await searchVideo(query);
        if (!video) return reply("No results found");

        await reply(`⬇️ Downloading video: ${video.title} (360p)`);

        const result = await downloadMedia(`https://youtu.be/${video.id}`, 'video');

        if (!result.success) {
            return reply(`❌ Download failed: ${result.error}`);
        }

        const stats = fs.statSync(result.filename);
        if (stats.size === 0) {
            fs.unlinkSync(result.filename);
            return reply("❌ Downloaded file is empty");
        }

        await conn.sendMessage(from, {
            video: fs.readFileSync(result.filename),
            caption: `*${result.title}* - 360p Quality`,
            mimetype: 'video/mp4'
        }, { quoted: mek });

        fs.unlinkSync(result.filename);
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while processing the video");
    }
});

module.exports = { downloadMedia, searchVideo };
