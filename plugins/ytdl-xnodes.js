const { cmd } = require("../command"); // Assuming you have a command handler
const ytdl = require("@distube/ytdl-core"); // For downloading YouTube videos
const playdl = require("play-dl"); // For searching YouTube videos
const fs = require("fs"); // For file system operations
const path = require("path"); // For path operations
const ffmpeg = require("fluent-ffmpeg"); // For audio conversion

// Ensure the ./store directory exists
const storeDir = "./store";
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir);
}

// Custom headers and options for ytdl
const cookies = [
  // Add your cookies here if needed
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

    // Download video
    const videoStream = ytdl(videoUrl, ytdlOptions);
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

      reply("```🔍 Searching for the song... 🎵```");

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

      reply("```🔍 Searching for the video... 🎥```");

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
