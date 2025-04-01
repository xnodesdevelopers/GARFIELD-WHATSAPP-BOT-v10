const { cmd } = require("../command");
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const PYTHON_PATH = process.platform === 'win32' ? 'python' : 'python3';
const PYTHON_SCRIPT = path.join(__dirname, "../lib/ytdls.py");

const downloadMedia = async (url) => {
    try {
        const rawOutput = execFileSync(PYTHON_PATH, [PYTHON_SCRIPT, url], { 
    
            encoding: 'utf-8'
        }).toString().trim();

        try {
            const result = JSON.parse(rawOutput);
            if (result.success && !fs.existsSync(result.filename)) {
                return { 
                    success: false, 
                    error: 'File not found after download' 
                };
            }
            return result;
        } catch (e) {
            return { 
                success: false, 
                error: `Invalid response: ${rawOutput}` 
            };
        }
    } catch (e) {
        return { 
            success: false, 
            error: `Download failed: ${e.message}` 
        };
    }
};

cmd({
    pattern: "play",
    react: "🎶",
    desc: "Download YouTube audio (m4a)",
    category: "main",
    use: ".play <query>",
    filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a search query");

        const video = await playdl.search(query, { 
            limit: 1,
            source: { youtube: "music" }
        }).catch(() => []);
        
        if (!video || !video[0]) return reply("No results found");
        
        await reply(`_Downloading...._
*${video[0].title}* 
High Quality From Using *Youtube Music*`)

        const result = await downloadMedia(video[0].url);
        if (!result.success) {
            return reply(`❌ Download failed: ${result.error}`);
        }

        await conn.sendMessage(from, {
            document: fs.readFileSync(result.filename),
            mimetype: 'audio/mp4',
            fileName: `${video[0].title}.m4a`
        }, { quoted: mek });

        fs.unlinkSync(result.filename);
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred");
    }
});
