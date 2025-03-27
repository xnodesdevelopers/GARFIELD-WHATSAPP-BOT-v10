const { cmd } = require("../command");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const playdl = require("play-dl");

// Configuration
const STORE_DIR = "./store";
const PYTHON_PATH = process.env.PYTHON_PATH || 'python3';

// Ensure store directory exists
if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR);
}

// Python script template
function getPythonScript(storeDir) {
    return `
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
        'outtmpl': '${storeDir}/%(title)s.%(ext)s',
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
    try:
        args = json.loads(sys.stdin.read())
        result = download_media(args['url'], args['media_type'])
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'success': False, 'error': f'Python runtime error: {str(e)}'}))
`;
}

// Helper functions
const callPythonDL = async (url, mediaType) => {
    return new Promise((resolve) => {
        const pythonScript = getPythonScript(STORE_DIR);
        const child = exec(`${PYTHON_PATH} -c "${pythonScript}"`, {
            maxBuffer: 50 * 1024 * 1024
        }, (error, stdout, stderr) => {
            if (error) {
                console.error('Execution error:', error);
                return resolve({ 
                    success: false, 
                    error: `Execution failed: ${error.message}`
                });
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (e) {
                console.error('Parse error:', e);
                resolve({ 
                    success: false, 
                    error: `Failed to parse response: ${e.message}`
                });
            }
        });

        // Send input to Python process
        child.stdin.end(JSON.stringify({ 
            url, 
            media_type: mediaType 
        }));
    });
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

            const result = await callPythonDL(`https://youtu.be/${video.id}`, 'audio');

            if (!result.success) {
                console.error('Download failed:', result.error);
                return reply(`❌ Download failed: ${result.error}\n\nTry again later or contact admin.`);
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
            reply("❌ An unexpected error occurred");
        }
    }
);

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


      const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;
            const result = await callPythonDL(`https://youtu.be/${video.id}`, 'video');

            if (!result.success) {
                console.error('Download failed:', result.error);
                return reply(`❌ Download failed: ${result.error}\n\nTry again later or contact admin.`);
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
            reply("❌ An unexpected error occurred");
        }
    }
);

// Cleanup handler
process.on('exit', () => {
    if (fs.existsSync(STORE_DIR)) {
        fs.rmSync(STORE_DIR, { recursive: true });
    }
});
