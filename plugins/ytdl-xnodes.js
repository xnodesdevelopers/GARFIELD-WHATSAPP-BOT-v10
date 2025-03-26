const { cmd } = require("../command");
const ytdl = require("garfield-ytdl");
const playdl = require("play-dl");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// Ensure the ./store directory exists
const storeDir = "./store";


// Custom headers and options for ytdl
const cookies = [
{
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "YSC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "t_HmzTh5omc"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "VISITOR_INFO1_LIVE",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "rQ81apo74qM"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "VISITOR_PRIVACY_METADATA",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "CgJHQhIEGgAgMA%3D%3D"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "PREF",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "tz=Asia.Colombo"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-ROLLOUT_TOKEN",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "CJy5rYyd-e6DCBCBk-i18p2MAxihmPXB8p2MAw%3D%3D"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "HSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "AZoFEL00JYN1EjeVz"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "SSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "AIVBWQT0lhzYoed6H"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "APISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "msFZvYs46PCbe0XM/AXQnQe2WwVsYIdyOB"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "SAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "SID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhT0aibC6e-KAn2azhZKBdwAACgYKAT8SARASFQHGX2MirXYmvMJ34yDNTX8BEX6QJBoVAUF8yKov3c7wb1XegdJRXhLVkl0c0076"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vh6PPomyhFWultXkoWQ1OznwACgYKAWkSARASFQHGX2MiM057HufCvNlCcbz7Y2PVeRoVAUF8yKpqaovc1I792nnpWfTE5KpQ0076"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhqunIOQAT6uUunqYLHsyrbAACgYKAfgSARASFQHGX2MiNYwW06M73dI9M3pX8hUwfxoVAUF8yKreaeDdJ2fc5Va_fo4Y-Fj10076"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "AFmmF2swRgIhALi65i_2kwRwS0OF2bwTm3LgwhZDvK33oKmE6MRKpuBbAiEAwHIvg6Enp--kBFpdFI7JVR6iz_7CneQEur2uO0BJkOI:QUQ3MjNmd3JJeEZlZFhybm5NbU1sT1d4ZS1lTGw4ZWo4cmRYOFJhTUNjRWRNdXZHMHNqOUdFZ29nQk0xWkM0VHNkTXg5U1pjZTBLbV9yTklkS0JqQXRlOXU5cEN0a3N5SWgtSFZXX0Z1NzZxMzZOcnN0ckxRMHdBM0ZBVU9SWDQ4bllfcFY0cXJoZlBmcUF6dnA0WllUNnNuenNESGRMZXlB"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "SIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "AKEyXzUQrM4CeXqPxnvuEZoasevCZwF5RNljrlMokwr63JTv_uEsZM2BSgI_6FfEo4QwUwipKg"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "AKEyXzVsGgc5zmwR8yP3-druKM4KDVEMAtp9vep0aVeOLUXOwYVrHdDXr8fszTqDLt2Bn7ttHQ"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "AKEyXzUa_upGGImV0sOfhuk3fBva9kSfvQrH3a_Ova0gzk-GQ6-b-5g-89x_vrAftvlt5-cK5w"
  }

];
const agent = ytdl.createAgent(cookies);

const ytdlOptions = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    },
    agent: agent,
};

// Helper function to handle errors
const handleErrors = (reply, errorMsg) => (e) => {
    console.error(e);
    reply(errorMsg);
};

// Video search function
const searchVideo = async (query) => {
    try {
        const results = await playdl.search(query, { limit: 1 });
        return results[0];
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};

// Modified audio download function
const downloadAndConvertAudio = async (videoUrl, title, reply, conn, from, mek) => {
    try {
        const sanitizedTitle = title.replace(/[^\w]/g, "_");
        const outputFile = path.join(storeDir, `${sanitizedTitle}.m4a`);

        // Get video info
        const info = await ytdl.getInfo(videoUrl, ytdlOptions);
        
        // Download audio stream (audio and video format)
        const audioStream = ytdl(videoUrl, { 
            filter: 'audioandvideo',
            ...ytdlOptions 
        });

        // Convert to M4A
        await new Promise((resolve, reject) => {
            ffmpeg(audioStream)
                .audioCodec('aac')
                .toFormat('ipod')
                .noVideo()
                .on('end', () => {
                    console.log('Conversion finished');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .save(outputFile);
        });

        // Send the file
        await conn.sendMessage(
            from,
            {
                audio: fs.readFileSync(outputFile),
                mimetype: "audio/mp4",
                fileName: `${sanitizedTitle}.m4a`,
            },
            { quoted: mek }
        );

        // Clean up
        fs.unlinkSync(outputFile);
    } catch (e) {
        handleErrors(reply, "❌ Audio download error")(e);
    }
};

// Song command
cmd(
    {
        pattern: "song",
        react: "🎶",
        desc: "Download YouTube audio as M4A",
        category: "main",
        use: ".song <query>",
        filename: __filename,
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const query = args.join(" ");
            if (!query) return reply("❗️ Please provide a search query");

            const video = await searchVideo(query);
            if (!video) return reply(`❌ No results for "${query}"`);

            const videoUrl = `https://youtu.be/${video.id}`;
                  // Send video details to the user
      const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
            // Send preview
            await conn.sendMessage(from, {
                image: { url: video.thumbnails[0].url },
                caption: ytmsg ,
            }, { quoted: mek });

            // Download and convert
            await downloadAndConvertAudio(videoUrl, video.title, reply, conn, from, mek);
        } catch (e) {
            handleErrors(reply, "❌ Download failed")(e);
        }
    }
);

// Video command
cmd(
    {
        pattern: "video",
        react: "🎥",
        desc: "Download YouTube videos",
        category: "main",
        use: ".video <query>",
        filename: __filename,
    },
    async (conn, mek, msg, { from, args, reply }) => {
        try {
            const query = args.join(" ");
            if (!query) return reply("❗️ Please provide a search query");

            const video = await searchVideo(query);
            if (!video) return reply(`❌ No results for "${query}"`);

            const videoUrl = `https://youtu.be/${video.id}`;
            const sanitizedTitle = video.title.replace(/[^\w]/g, "_");
            const outputFile = path.join(storeDir, `${sanitizedTitle}.mp4`);

            // Download video stream
            const videoStream = ytdl(videoUrl, ytdlOptions);

            // Download video
            await new Promise((resolve, reject) => {
                videoStream
                    .pipe(fs.createWriteStream(outputFile))
                    .on('finish', resolve)
                    .on('error', reject);
            });  
                  const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;

            // Send video
            await conn.sendMessage(
                from,
                {
                    video: fs.readFileSync(outputFile),
                    mimetype: "video/mp4",
                    caption: ytmsg,
                },
                { quoted: mek }
            );

            // Clean up
            fs.unlinkSync(outputFile);
        } catch (e) {
            handleErrors(reply, "❌ Download failed")(e);
        }
    }
);
