
const { cmd } = require("../command"); // Assuming you have a command handler
const ytdl = require("garfield-ytdl"); // For downloading YouTube videos
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
    "name": "GPS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "1"
  },
  {
    "domain": ".youtube.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "YSC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "8P5xypq0HNI"
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
    "value": "8zLOKUr7WwA"
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
    "value": "CgJHQhIEGgAgRQ%3D%3D"
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
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "value": "sidts-CjEB7pHptZsuafLBTmLVdy2FgcGDQ8Y6q4SvnElAKMEJueaHjuqKMA5ukDVkLCwHiekJEAA"
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
    "value": "sidts-CjEB7pHptZsuafLBTmLVdy2FgcGDQ8Y6q4SvnElAKMEJueaHjuqKMA5ukDVkLCwHiekJEAA"
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
    "value": "AFIknu3GL_fCIPVnE"
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
    "value": "AA2YkDJ9WwJvrsL5b"
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
    "value": "5X31BXfVw-wreDgY/Au8TqwFud1oOlhRFS"
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
    "value": "T2YxYg4s1JPdUynU/AwgbdyH_mmbCYGRr4"
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
    "value": "T2YxYg4s1JPdUynU/AwgbdyH_mmbCYGRr4"
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
    "value": "T2YxYg4s1JPdUynU/AwgbdyH_mmbCYGRr4"
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
    "value": "g.a000vQhqA7ss3wZHxXhgkYwCwTKNFD4pMT0pQIUdN8bnwh7smsEFUa8JI5nxY-Qf4xeZHw_dQgACgYKAWESARASFQHGX2MiUz43plcxXZ6RR23XiwsUjxoVAUF8yKqbu0XhRNinuBI_aaLvdFbX0076"
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
    "value": "g.a000vQhqA7ss3wZHxXhgkYwCwTKNFD4pMT0pQIUdN8bnwh7smsEFzW0cYHFzRfBlZ2hf5Y52GQACgYKAT4SARASFQHGX2MisahmqIdNyShuPquAHu3XhRoVAUF8yKoZNE7iL7m3d8euhfEzCuGl0076"
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
    "value": "g.a000vQhqA7ss3wZHxXhgkYwCwTKNFD4pMT0pQIUdN8bnwh7smsEFGDDvADYM0VhwvDcPmt_HmAACgYKAVUSARASFQHGX2MitzLPw1G4OJiNzV_NXsqWfhoVAUF8yKrDwUSNQEzRZV9GtKwD0gNY0076"
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
    "value": "CKe_3Z6Zg9uOJhCPj6y2jraMAxjPseLpjraMAw%3D%3D"
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
    "value": "AFmmF2swRAIgSQJmfCiB_EFPxBmaUg0B-KbwnwsT2L4EI74F8OgklLgCIF6XO3DvyKVixTuXui4rr8NrZmjLo-Jm_ckmXwBlcN8J:QUQ3MjNmelVNeFdEcmJZa2FnS21hM2N2UGZPaUs4ZjFaRTdRODhmVHZkWU93R0NuOFlfVVJRTnV3cUJ1QXdXQldzZkhPU0VUaXI3ckxVVGpxYXFpZkN4S3I5VThJX1pIaU9oS1dqbG1kRHhOR1RYU1hqNXlpaGM2aVZXZzdUNXJVTTN3YS01c0RWdkM1MkxIemxqTjBTd0VSdks4SURjVld3"
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
    "value": "AKEyXzWmLd6Nm3Fv1Dy1P-LHGpBtZ5IEo3rgnn9ApXpTpR9qLutYsK2ZdhN9MG5_evn6M97H6A"
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
    "value": "AKEyXzUEj_cI3s3yZGSEgelnTDOlwtP4A9ABvtD-n-md9_nyzHTg3LJKzKxw48V_KnWQUomM"
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
    "value": "AKEyXzUt5-_t4s6vidgD9s8A5l82Q7KpQlhILJk0prSocpIFcrBfOCvpQYvyykoG-rboiAA6"
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
    const info = await ytdl.getInfo(videoUrl, ytdlOptions);
    const videoFormat = ytdl
      .filterFormats(info.formats, "videoandaudio")
      .find((f) => f.qualityLabel === "360p");

    if (!videoFormat) {
      return reply("❌ No suitable video format found. 😢");
    }

    // Download video with custom options
    const videoStream = ytdl.downloadFromInfo(info, {
      quality: videoFormat.itag,
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
      const info = await ytdl.getInfo(videoUrl, ytdlOptions);
      const videoFormat = ytdl
        .filterFormats(info.formats, "videoandaudio")
        .find((f) => f.qualityLabel === "360p");

      if (!videoFormat) {
        return reply("❌ No suitable video format found. 😢");
      }

      // Download video with custom options
      const videoStream = ytdl.downloadFromInfo(info, {
        quality: videoFormat.itag,
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
