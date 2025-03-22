const { cmd } = require("../command"); // Assuming you have a command handler
const ytdl = require("@distube/ytdl-core"); // For downloading YouTube videos
const playdl = require("play-dl"); // For searching YouTube videos
const fs = require("fs"); // For file system operations
const path = require("path"); // For path operations
const ffmpeg = require("fluent-ffmpeg"); // For audio conversion

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
// Create a custom agent with cookies
const agent = ytdl.createAgent(cookies);

// Custom headers and options for ytdl
const ytdlOptions = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  },
  agent: agent, // Use the custom agent with cookies
};

// Helper function to handle errors
const handleErrors = (reply, errorMsg) => (e) => {
  console.error(e); // Log errors for debugging
  reply(errorMsg);
};

// Function to search for a video using play-dl
const searchVideo = async (query) => {
  try {
    const results = await playdl.search(query, { limit: 1 }); // Search for the video
    return results[0]; // Return the first result
  } catch (e) {
    console.error("Error searching for video:", e); // Log search errors
    return null;
  }
};

// Function to download and convert audio to m4a
const downloadAndConvertAudio = async (videoUrl, title, reply, conn, from, mek) => {
  try {
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize title for file name
    const tempVideoFile = path.join(storeDir, `${sanitizedTitle}.mp4`); // Temporary video file
    const tempAudioFile = path.join(storeDir, `${sanitizedTitle}.m4a`); // Temporary audio file

    // Get video info
    // Get video info
const info = await ytdl.getInfo(videoUrl, ytdlOptions);

// Find the format with the specified itag (e.g., itag 18 for 360p)
const videoFormat = info.formats.find((f) => f.itag === 18); // Replace 18 with the desired itag

if (!videoFormat) {
  return reply("❌ No suitable video format found for the specified itag. 😢");
}

// Download video with the specified itag
const videoStream = ytdl.downloadFromInfo(info, {
  format: videoFormat, // Use the format with the specified itag
  ...ytdlOptions,
});
    await new Promise((resolve, reject) => {
      videoStream
        .pipe(fs.createWriteStream(tempVideoFile))
        .on("finish", resolve)
        .on("error", reject);
    });

    // Convert video to m4a using ffmpeg (optimized for speed)
    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoFile)
        .output(tempAudioFile)
        .audioCodec("copy") // Directly copy the audio stream (no re-encoding)
        .noVideo() // Skip video processing
        .on("end", () => {
          console.log("Audio conversion finished");
          resolve();
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .run();
    });

    // Send the m4a file to the user
    await conn.sendMessage(
      from,
      {
        audio: fs.readFileSync(tempAudioFile), // Read the m4a file
        mimetype: "audio/mp4", // Set MIME type for AAC audio
        fileName: `${title}.m4a`, // Use the title as the file name
      },
      { quoted: mek }
    );

    // Clean up temporary files
    fs.unlinkSync(tempVideoFile); // Delete the temporary video file
    fs.unlinkSync(tempAudioFile); // Delete the temporary audio file
  } catch (e) {
    handleErrors(reply, "❌ An error occurred while processing your request. 😢")(e);
  }
};

// Command to download and send audio
cmd(
  {
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio by searching for keywords.",
    category: "main",
    use: ".song <song name or keywords>",
    filename: __filename,
  },
  async (conn, mek, msg, { from, args, reply }) => {
    try {
      const searchQuery = args.join(" "); // Get the search query
      if (!searchQuery) {
        return reply("❗️ Please provide a song name or keywords. 📝\nExample: .song Despacito");
      }



      // Search for the song
      const video = await searchVideo(searchQuery);

      if (!video) {
        return reply(`❌ No results found for "${searchQuery}".`);
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`; // Get video URL

      // Send video details to the user
      const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || "N/A"}\n*🎙️ Artist* - ${video.channel?.name || "Unknown"}\n> File Name ${video.title}.m4a`;
      await conn.sendMessage(from, {
        image: { url: video.thumbnails[0].url }, // Send video thumbnail
        caption: ytmsg, // Send video details
      });

      // Download, convert, and send audio
      await downloadAndConvertAudio(videoUrl, video.title, reply, conn, from, mek);
    } catch (e) {
      handleErrors(reply, "❌ An error occurred while processing your request. 😢")(e);
    }
  }
);

cmd(
  {
    pattern: "video",
    react: "🎥",
    desc: "Download YouTube video by searching for keywords.",
    category: "main",
    use: ".video <video name or keywords>",
    filename: __filename,
  },
  async (conn, mek, msg, { from, args, reply }) => {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return reply(
          `❗️ Please provide a video name or keywords. 📝\nExample: .video Despacito`
        );
      }

     

      // Search for the video using play-dl
      const video = await searchVideo(searchQuery);

      if (!video) {
        return reply(`❌ No results found for "${searchQuery}".`);
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

      // Format details message
      const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || "N/A"}\n*👤 Author* - ${video.channel?.name || "Unknown"}\n`;

      const sanitizedTitle = video.title.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize title for file name
      const tempFileName = `./store/yt_video_${sanitizedTitle}.mp4`;

      // Get video info with custom options
      // Get video info
const info = await ytdl.getInfo(videoUrl, ytdlOptions);

// Find the format with the specified itag (e.g., itag 18 for 360p)
const videoFormat = info.formats.find((f) => f.itag === 18); // Replace 18 with the desired itag

if (!videoFormat) {
  return reply("❌ No suitable video format found for the specified itag. 😢");
}

// Download video with the specified itag
const videoStream = ytdl.downloadFromInfo(info, {
  format: videoFormat, // Use the format with the specified itag
  ...ytdlOptions,
});
      await new Promise((resolve, reject) => {
        videoStream
          .pipe(fs.createWriteStream(tempFileName))
          .on("finish", resolve)
          .on("error", reject);
      });

      // Send the video file
      await conn.sendMessage(
        from,
        {
          video: fs.readFileSync(tempFileName),
          mimetype: "video/mp4",
          caption: ytmsg,
        },
        { quoted: mek }
      );

      // Delete the temporary file
      fs.unlinkSync(tempFileName);
    } catch (e) {
      handleErrors(reply, "❌ An error occurred while processing your request. 😢")(e);
    }
  }
);
