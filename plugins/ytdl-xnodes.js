මෙහි python script එක වෙනම lib/ytdl.py ලෙස හා js file එක plugins/ytd.js 
ලෙස වෙන වෙනම තියා ලියන්න
const { cmd } = require("../command");
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const STORE_DIR = path.join(__dirname, "./store");
const PYTHON_PATH = process.platform === 'win32' ? 'python' : 'python3';

// Ensure store directory exists with proper error handling
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

const handleErrors = (reply, errorMsg) => (e) => {
    console.error(e);
    reply(errorMsg);
};

// Python download function
const downloadMedia = async (url, type, quality) => {
    const pyScript = `
import yt_dlp
import json
import sys
import os

url = sys.argv[1]
media_type = sys.argv[2]
quality = sys.argv[3]
store_dir = sys.argv[4]

ydl_opts = {
    'format': f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]' if media_type == 'video' else f'bestaudio[abr<=128]/best',
    'outtmpl': os.path.join(store_dir, '%(id)s.%(ext)s'),
    'quiet': True,
    'no_warnings': True,
    'extract_flat': False,
    'postprocessors': [{
        'key': 'FFmpegVideoConvertor' if media_type == 'video' else 'FFmpegExtractAudio',
        'preferedformat': 'mp4' if media_type == 'video' else 'mp3'
    }]
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        print(json.dumps({
            'success': True,
            'filename': filename,
            'title': info.get('title'),
            'duration': info.get('duration'),
            'thumbnail': info.get('thumbnail')
        }))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`;

    try {
        const result = execSync(
            `${PYTHON_PATH} -c "${pyScript}" "${url}" "${type}" "${quality}" "${STORE_DIR}"`,
            { maxBuffer: 50 * 1024 * 1024 }
        ).toString();
        return JSON.parse(result);
    } catch (e) {
        return { success: false, error: e.message };
    }
};

// Search video using play-dl
const searchVideo = async (query) => {
    try {
        // Increased search results for better matching
        const results = await playdl.search(query, { limit: 5 });
        return results[0]; // Return first result
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};

// Song command
cmd(
    {
        pattern: "song",
        react: "🎶",
        desc: "Download YouTube audio (128kbps)",
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
      const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
      await conn.sendMessage(from, {
        image: { url: video.thumbnails[0].url }, // Send video thumbnail
        caption: ytmsg, // Send video details
      });


            const result = await downloadMedia(
                `https://youtu.be/${video.id}`,
                'audio',
                '360'
            );

            if (!result.success) {
                console.error('Download failed:', result.error);
                return reply(`❌ Download failed: ${result.error}`);
            }

            // Add file size check
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

// Video command (360p)
cmd(
    {
        pattern: "video",
        react: "🎥",
        desc: "Download YouTube video (360p)",
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
                '360'
            );

            if (!result.success) {
                console.error('Download failed:', result.error);
                return reply(`❌ Download failed: ${result.error}`);
            }

            // Add file size check
            const stats = fs.statSync(result.filename);
            if (stats.size === 0) {
                fs.unlinkSync(result.filename);
                return reply("❌ Downloaded file is empty");
            }
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
            reply("❌ An error occurred");
        }
    }
);

// Improved cleanup handler
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
