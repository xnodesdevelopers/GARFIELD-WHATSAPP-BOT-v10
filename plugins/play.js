const { cmd } = require("../command");
const fs = require('fs').promises; // Async file operations
const path = require('path');
const playdl = require("play-dl");

// Load the Rust module (assumes yt.node is in the project root)
const { downloadVideo } = require('../../yt.node');

// Sanitize filenames
const cleanFilename = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_');

// Your YouTube cookies
const YOUTUBE_COOKIES = "YSC=y3J2I4ug7_Y; GPS=1; __Secure-ROLLOUT_TOKEN=CMjptNCdkZS38wEQ3qrKy42sjAMY6rHWzI2sjAM%3D; VISITOR_INFO1_LIVE=23fLZJsdyko; VISITOR_PRIVACY_METADATA=CgJTRxIEGgAgYg%3D%3D; PREF=tz=Asia.Colombo; __Secure-1PSIDTS=sidts-CjIB7pHptT6ynkkbQXBB356bDAaOriEsmD956xf_2vHr-JcQOQbTWpb8KVsEOk06swPOuBAA; __Secure-3PSIDTS=sidts-CjIB7pHptT6ynkkbQXBB356bDAaOriEsmD956xf_2vHr-JcQOQbTWpb8KVsEOk06swPOuBAA; HSID=Aniy9moFdgwAbwxhX; SSID=AOg1LQ_s6ntw10z_Z; APISID=CvDxwK2BItUN-tzF/AuAXNKzT-xawmDzkr; SAPISID=0gUDI6X8EmM3hVCQ/AIYKsf_mXQbuii33D; __Secure-1PAPISID=0gUDI6X8EmM3hVCQ/AIYKsf_mXQbuii33D; __Secure-3PAPISID=0gUDI6X8EmM3hVCQ/AIYKsf_mXQbuii33D; SID=g.a000vQhqA8tVsc04y5PE0GMxExNyfgXq_m0_c1Ls5wD9MUImO_Spf5ujzjfbNmvHhCgoMBDrRQACgYKAfkSARASFQHGX2MiPlbWPNWVwhe6pjbzYIjwshoVAUF8yKpov3-JaFWc1qiTukHtQYzm0076; __Secure-1PSID=g.a000vQhqA8tVsc04y5PE0GMxExNyfgXq_m0_c1Ls5wD9MUImO_SprZyHJbhxnN_8dLRD5XAHpgACgYKATcSARASFQHGX2MiH3bMYpm0n3Zdt8WVGOivmxoVAUF8yKpGMEJwoIRbUdZcUuFprUMq0076; __Secure-3PSID=g.a000vQhqA8tVsc04y5PE0GMxExNyfgXq_m0_c1Ls5wD9MUImO_Sp15ZHmt6cN6TQnilPhMWTgwACgYKATsSARASFQHGX2Mi6VpMNVdKtVF-tanfhe3aYBoVAUF8yKq0EqaR5MEyL34UgLqeT7IY0076; LOGIN_INFO=AFmmF2swRAIgBqcuJdssqOxuxg1q7aAdYMiL9t9Ty2f5Fk--YU6VPT0CIC2axghJpTkIXImas4PDBGqto0RbkXw27E6S_Xm-9nUe:QUQ3MjNmdzRkWlFveUFKb0gzUTQzZURKWlhHR3VnRko5dnYzMXk2dWM4dm9kTFhCOFhoeXVhVnFRM2tvZlA2MHJ3UHhNVWltN2JlZ3lLbTM5dG1NNVhYcWxTQXNPSXVBcGdhWFh3R3hkNWo0MzdMcUV3Qm1idFkwMTlfRWw5clRpdkVpeUtVT3dWVTR3UWxBcG1rYTZBSjlaaDkzNFRsODZ3; SIDCC=AKEyXzU2Mau8Xeyalya-QpgofKjsThOgTEBvTuDFNd7vt1NCqseBWDPxPeuBWuSr5jlTaQAswQ; __Secure-1PSIDCC=AKEyXzXEaXyQhaq-BoAMKs9wCy5uyAM4F7vCnsglk9dMUuwwu1vUUkssI4FUNTlApJUipfbW; __Secure-3PSIDCC=AKEyXzXHwKzK7RtG_H4FCMOAflpSs3DPBeq73xTvVWXmrCuTAwOXG5YCIGZbU5ERoNxlb9zh";

// Download media using the Rust module
const downloadMedia = async (url, type) => {
    const outputPath = path.join(__dirname, '../lib/store', `${cleanFilename(url.split('v=')[1] || 'media')}.${type === 'audio' ? 'm4a' : 'mp4'}`);
    const audioOnly = type === 'audio';

    console.log(`Downloading ${type} to ${outputPath}`);

    return new Promise((resolve, reject) => {
        downloadVideo(url, outputPath, audioOnly, YOUTUBE_COOKIES, (err) => {
            if (err) {
                console.error('Rust download error:', err);
                reject({ success: false, error: `Download failed: ${err.message}` });
                return;
            }

            fs.stat(outputPath)
                .then(stats => {
                    if (stats.size === 0) {
                        fs.unlink(outputPath);
                        reject({ success: false, error: 'Downloaded file is empty' });
                    } else {
                        resolve({
                            success: true,
                            filename: outputPath,
                            title: 'Downloaded Media',
                            duration: 0
                        });
                    }
                })
                .catch(() => reject({ success: false, error: 'Output file not found' }));
        });
    });
};

// Search for a YouTube video
const searchVideo = async (query) => {
    try {
        const results = await playdl.search(query, { limit: 5 });
        return results[0];
    } catch (e) {
        console.error("Search error:", e);
        return null;
    }
};

// Song command (.play)
cmd({
    pattern: "play",
    react: "🎶",
    desc: "Download YouTube audio as m4a",
    category: "main",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a search query");

        const video = await searchVideo(query);
        if (!video) return reply("No results found");

        await reply(`_Downloading...._
*${video.title}* 
High Quality From Using *Youtube Music*`);

        const result = await downloadMedia(`https://youtu.be/${video.id}`, 'audio');

        if (!result.success) {
            return reply(`❌ Download failed: ${result.error}`);
        }

        await conn.sendMessage(from, {
            document: { url: result.filename }, // Assumes conn supports file paths; adjust if buffer needed
            mimetype: 'audio/mp4',
            fileName: `${video.title}.m4a`
        }, { quoted: mek });

        await fs.unlink(result.filename); // Clean up
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while processing the audio");
    }
});

// Video command (.ytmp4)
cmd({
    pattern: "ytmp4",
    react: "🎥",
    desc: "Download YouTube video as 360p mp4",
    category: "main",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply("Please provide a search query");

        const video = await searchVideo(query);
        if (!video) return reply("No results found");

        const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;

        const result = await downloadMedia(`https://youtu.be/${video.id}`, 'video');

        if (!result.success) {
            return reply(`❌ Download failed: ${result.error}`);
        }

        await conn.sendMessage(from, {
            video: { url: result.filename }, // Assumes conn supports file paths; adjust if buffer needed
            caption: ytmsg,
            mimetype: 'video/mp4'
        }, { quoted: mek });

        await fs.unlink(result.filename); // Clean up
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while processing the video");
    }
});

module.exports = { downloadMedia, searchVideo };
