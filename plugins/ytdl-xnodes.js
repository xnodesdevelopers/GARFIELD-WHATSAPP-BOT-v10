const { cmd } = require("../command");
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const STORE_DIR = "./store";
const PYTHON_PATH = process.env.PYTHON_PATH || 'python3';
const PYTHON_SCRIPT = `
import yt_dlp
import sys
import json
import os

def sanitize_filename(title):
    keepchars = (' ','.','_','-')
    return "".join(c for c in title if c.isalnum() or c in keepchars).rstrip()

def download_media(url, media_type):
    ydl_opts = {
        'format': 'bestvideo[height<=360]+bestaudio/best[height<=360]' if media_type == 'video' else 'bestaudio[abr<=128]/best',
        'outtmpl': f'${STORE_DIR}/%(title)s.%(ext)s',
        'quiet': True,
        'no_warnings': True,
        'postprocessors': [
            {
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4'
            } if media_type == 'video' else {
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '128'
            }
        ],
        'extractaudio': media_type == 'audio',
        'keepvideo': media_type == 'video',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            return {
                'success': True,
                'filename': filename,
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', '')
            }
    except Exception as e:
        return {'success': False, 'error': str(e)}

if __name__ == "__main__":
    args = json.loads(sys.stdin.read())
    result = download_media(args['url'], args['media_type'])
    print(json.dumps(result))
`;

// Ensure store directory exists
if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR);
}

// Helper functions
const callPythonDL = async (url, mediaType) => {
    const input = JSON.stringify({ url, media_type: mediaType });
    try {
        const result = execSync(`${PYTHON_PATH} -c "${PYTHON_SCRIPT}"`, { 
            input,
            maxBuffer: 50 * 1024 * 1024,
            stdio: ['pipe', 'pipe', 'ignore']
        }).toString();
        return JSON.parse(result);
    } catch (e) {
        console.error('Python error:', e);
        return { success: false, error: e.message };
    }
};

const searchVideo = async (query) => {
    try {
        const results = await playdl.search(query, { limit: 1 });
        return results[0];
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};

const cleanFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

// Command handlers
cmd(
    {
        pattern: "song",
        react: "🎶",
        desc: "Download YouTube audio (128kbps)",
        category: "main",
        use: ".song <query>"
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const query = args.join(' ');
            if (!query) return reply("Please provide a search query");

            const video = await searchVideo(query);
            if (!video) return reply("No results found");

            const result = await callPythonDL(`https://youtu.be/${video.id}`, 'audio');

            if (!result.success) {
                return reply(`❌ Download failed: ${result.error}`);
            }
          const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
      await conn.sendMessage(from, {
        image: { url: video.thumbnails[0].url }, // Send video thumbnail
        caption: ytmsg, // Send video details
      });
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
    }
);

cmd(
    {
        pattern: "video",
        react: "🎥",
        desc: "Download YouTube video (360p)",
        category: "main",
        use: ".video <query>"
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const query = args.join(' ');
            if (!query) return reply("Please provide a search query");

            const video = await searchVideo(query);
            if (!video) return reply("No results found");

            const result = await callPythonDL(`https://youtu.be/${video.id}`, 'video');

            if (!result.success) {
                return reply(`❌ Download failed: ${result.error}`);
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
            reply("❌ An error occurred while processing your request");
        }
    }
);

// Cleanup handler
process.on('exit', () => {
    // Clean up store directory on exit
    if (fs.existsSync(STORE_DIR)) {
        fs.rmSync(STORE_DIR, { recursive: true });
    }
});
