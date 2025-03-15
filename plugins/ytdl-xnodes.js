const { cmd } = require("../command");
const ytdl = require("@distube/ytdl-core"); // Using the latest ytdl-core directly (2025)
const { search } = require("play-dl"); // Using play-dl for faster searches
const fs = require("fs/promises"); // Using promise-based fs
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { pipeline } = require("stream/promises"); // Using stream/promises for better async handling
const cacheManager = require("cache-manager"); // For caching results
const { default: axios } = require("axios"); // For direct downloading

ffmpeg.setFfmpegPath(ffmpegPath);

// Create cache for search results and info
const memoryCache = cacheManager.caching({
  store: "memory",
  ttl: 3600, // Cache for 1 hour
  max: 100 // Maximum number of items in cache
});

// Cookie configuration as requested
const cookies = [
  

  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "GPS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "1"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "YSC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "OF3DmH4g2L4"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "VISITOR_INFO1_LIVE",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "kWji5hM-46c"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "VISITOR_PRIVACY_METADATA",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "CgJTRxIEGgAgIQ%3D%3D"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "PREF",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "tz=Asia.Colombo"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-ROLLOUT_TOKEN",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "CLaU152y-6fp3gEQtOzEjdaIjAMYn9zlt9aIjAM%3D"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "YTSESSION-rvkia",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "ANPz9KgP1uSD2+uRBCHE/fBE9O4y3IphvPueiDZ1hf0jDEP71ue9wOYwI5kl6vgSueilJeGbcpLogCpQBPQY64V0wJN9mc8Fn7XiuCPZWAdOasg/gI9KjEqetmAgJtMfmlDFv1YvUIFMqFM8yx1OCq3hPj8j5Ji7QC4jZnCdBSq9GOjKkCzmjCWGqBJHK/w/vVSGhF/S6+zxLkvVcvYeSINL1B9hZurc0VPBGXEvVh/mwGhf89tSoY7prsryGdbXl8ZtyWuBSeh8H6FgBAdla834hGQNmvxyDt42eczUOc+hDaRIJ7U4OpJuDmoEUkWDU76XJWlB05sxQSXV+Hprh8YsDsLcqfCF411+pWVTLl8"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDTS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDTS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "HSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "AmrtQhN3aX5kcbWfq"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "SSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "AZ3oqx3AE_htMgthf"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "APISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "-8C0h6WF6tMjTvcs/ARG0k-KxYXbfEQnot"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "SAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "SID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYfRYpcvrkI-rzRGjP4ZDdYQACgYKAWUSARASFQHGX2Miw5ynhZI9ppnxfwk7v_q1yBoVAUF8yKq_hWCBWFQeCOF9DvdprxRs0076"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiY73neOHnACBcva_antC0pogACgYKAbsSARASFQHGX2Mi7xANfiijeaFYl-6Q7aXmeRoVAUF8yKqcyKmUuiMu3B9OBbg0A-dQ0076"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYpJp6Tt6olvXaizeuoTb0RgACgYKAaISARASFQHGX2MiXZSXai3QW0q6PbNUg9H_yhoVAUF8yKr0HTbFVhMrFOYmdTGecwmp0076"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "LOGIN_INFO",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "AFmmF2swRQIhAOkHcIT_u0rmuInXWbtgazJB3eMqbTpE1S9OpMDjnNpDAiA-V1ObRnnbOtIAFgHQgx7wBB9Nq7rp-ZgUowax0ecmVQ:QUQ3MjNmeVM3MHR1NGZfYkVPbHYxOTMxNi1yWGREWHBlMHc3cHJsX25sZVdUY1IxSktsNi1mekJUVFhFNEdsZVNHbmJjOTJyblJCMWNoZVlKQUZlMXRPbzZxQ3duZ1FpbUU5Wi14XzFQQ2VNZHZ6TG9qdnJBSlAwbFJPOFlTdV9ZVFBhak94OVVQME0zUmY1R2Q0a3ZOeW9ISG1iRkRsSDR3"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "SIDCC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "AKEyXzUXL3M5ifARD-ktGih8aQLKjQcJxcCnezvnZkziU27keQC4gHYohJFd-e9G5wwb3r5E"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDCC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "AKEyXzWM3YZJCYRgJeQKafe75_XUQf_4z6iRLKhqLyl9CpD6XNt75-ZfFAW3R09Ku9BVxOLz0w"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDCC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "AKEyXzXA3n2KWC-da2yAC8i0qGKsuKsKn_VYQQY7PCMvCYKwXJhsqF2WMkCdTsFPB1FeNk6sMw"
  },
  {
    domain: ".youtube.com",
    hostOnly: false,
    httpOnly: true,
    name: "ST-a4n57e",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "csn=97RlpxVlHs01br0r&itct=CCoQ_FoiEwj6qpLg1oiMAxXqY50JHVh_A5AyCmctaGlnaC1yZWNaD0ZFd2hhdF90b193YXRjaJoBBhCOHhieAQ%3D%3D"
    }
 
]; // Add your cookies here if needed

const agent = ytdl.createAgent(cookies);

// Enhanced ytdl options with agent for both audio and video
const ytdlOptions = {
  quality: "highestaudio",
  filter: "audioonly",
  highWaterMark: 1 << 25, // 32MB buffer for faster downloads
  requestOptions: {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    }
  },
  agent: agent, // Using the agent with cookies
};

// Video download options for 360p with cookie agent
const videoOptions = {
  quality: 'medium', // This targets 360p quality
  filter: format => format.qualityLabel === '360p' && format.container === 'mp4',
  highWaterMark: 1 << 25, // 32MB buffer for faster downloads
  requestOptions: {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    }
  },
  agent: agent, // Using the agent with cookies
};

// Ensure store directory exists
const ensureStoreDir = async () => {
  const storeDir = "./store";
  try {
    await fs.access(storeDir);
  } catch {
    await fs.mkdir(storeDir, { recursive: true });
  }
  return storeDir;
};

// Helper to clean temp files
const cleanupFiles = async (files) => {
  for (const file of files) {
    try {
      await fs.unlink(file);
    } catch (err) {
      console.error(`Failed to delete ${file}:`, err);
    }
  }
};

// Audio conversion with optimized settings
const convertAudio = async (input, output) => {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioBitrate(128) // Higher quality bitrate
      .audioCodec("libmp3lame") // Explicitly use MP3 encoder
      .audioChannels(2) // Stereo audio
      .outputOptions(["-threads 4"]) // Use multiple threads
      .format("mp3")
      .on("end", resolve)
      .on("error", reject)
      .save(output);
  });
};

// Function to get video info with proper format selection
const getVideoInfo = async (videoUrl) => {
  const info = await ytdl.getInfo(videoUrl, { agent: agent }); // Using agent with cookies
  
  // Get available formats
  const formats = info.formats;
  
  // Find the best 360p mp4 format
  const format360p = formats.find(format => 
    format.qualityLabel === '360p' && 
    format.container === 'mp4' && 
    format.hasVideo && 
    format.hasAudio
  );
  
  // Fall back to another format if 360p isn't available
  const fallbackFormat = formats.find(format => 
    format.hasVideo && 
    format.hasAudio && 
    format.container === 'mp4'
  );
  
  return {
    info,
    videoFormat: format360p || fallbackFormat
  };
};

// Search function to avoid duplication
const searchVideo = async (searchQuery) => {
  // Check cache for search results
  const cacheKey = `search:${searchQuery}`;
  let searchResults = await memoryCache.get(cacheKey);

  if (!searchResults) {
    // Use play-dl for faster search
    searchResults = await search(searchQuery, { limit: 1 });
    if (searchResults && searchResults.length > 0) {
      await memoryCache.set(cacheKey, searchResults);
    }
  }

  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  return searchResults[0];
};

// Audio download and conversion
cmd(
  {
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio by searching keywords.",
    category: "main",
    use: ".song <keywords>",
    filename: __filename,
  },
  async (conn, mek, msg, { from, args, reply }) => {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return reply("❗️ Provide song name or keywords.\nExample: .song Despacito");
      }

      await reply("```🔍 Searching for the song...```");

      const video = await searchVideo(searchQuery);
      
      if (!video) {
        return reply(`❌ No results found for "${searchQuery}".`);
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
      
      // Format details message
      const ytmsg = `*🎶 Song Name* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*📻 Listeners* - ${video.views?.toLocaleString() || 'N/A'}\n*🎙️ Artist* - ${video.channel?.name || 'Unknown'}\n> File Name ${video.title}.mp3`;

      // Send song details with thumbnail
      await conn.sendMessage(from, { 
        image: { url: video.thumbnails[0].url }, 
        caption: ytmsg 
      });

      // Send processing message

      // Ensure store directory exists
      const storeDir = await ensureStoreDir();

      // Create unique file names
      const timestamp = Date.now();
      const tempFileName = path.join(storeDir, `yt_audio_${timestamp}.mp4`);
      const outputFileName = path.join(storeDir, `yt_audio_${timestamp}.mp3`);

      // Use ytdl to stream the audio with optimized settings and cookie agent
      const audioStream = ytdl(videoUrl, ytdlOptions);
      
      // Write to file with stream/promises
      await pipeline(audioStream, fs.createWriteStream(tempFileName));

      // Convert audio with optimized settings
      await convertAudio(tempFileName, outputFileName);

      // Read the converted file
      const audioBuffer = await fs.readFile(outputFileName);

      // Send the audio file
      await conn.sendMessage(
        from,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          fileName: `${video.title}.mp3`,
        },
        { quoted: mek }
      );

      // Clean up temporary files
      await cleanupFiles([tempFileName, outputFileName]);

    } catch (error) {
      console.error("Error in song command:", error);
      reply("❌ An error occurred while processing your request. Please try again later.");
    }
  }
);

// Video download command
cmd(
  {
    pattern: "video",
    react: "🎬",
    desc: "Download YouTube video (360p) by searching keywords.",
    category: "main",
    use: ".video <keywords>",
    filename: __filename,
  },
  async (conn, mek, msg, { from, args, reply }) => {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return reply("❗️ Provide video name or keywords.\nExample: .video Despacito");
      }

      await reply("```🔍 Searching for the video...```");

      const video = await searchVideo(searchQuery);
      
      if (!video) {
        return reply(`❌ No results found for "${searchQuery}".`);
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

      // Format details message
      const ytmsg = `*🎬 Video Title* - ${video.title}\n*🕜 Duration* - ${video.durationRaw}\n*👁️ Views* - ${video.views?.toLocaleString() || 'N/A'}\n*👤 Author* - ${video.channel?.name || 'Unknown'}\n`;

      // Send video details with thumbnail
    

      // Send processing message

      // Ensure store directory exists
      const storeDir = await ensureStoreDir();

      // Get video info with format selection (using cookie agent)
      const { videoFormat } = await getVideoInfo(videoUrl);
      
      if (!videoFormat) {
        return reply("❌ Couldn't find a suitable 360p video format. Try another video.");
      }

      // Create unique file name
      const timestamp = Date.now();
      const videoFileName = path.join(storeDir, `yt_video_${timestamp}.mp4`);

      // Use ytdl to stream the video with selected format and cookie agent
      const videoStream = ytdl(videoUrl, { 
        format: videoFormat,
        agent: agent // Using the agent with cookies
      });
      
      // Write to file with stream/promises for better performance
      await pipeline(videoStream, fs.createWriteStream(videoFileName));

      // Read the video file
      const videoBuffer = await fs.readFile(videoFileName);

      // Send processing complete message

      // Send the video file
      await conn.sendMessage(
        from,
        {
          video: videoBuffer,
          mimetype: "video/mp4",
          fileName: `${video.title}.mp4`,
          caption: ytmsg,
        },
        { quoted: mek }
      );

      // Clean up temporary files
      await cleanupFiles([videoFileName]);

    } catch (error) {
      console.error("Error in video command:", error);
      reply("❌ An error occurred while processing your request. Please try again later.");
    }
  }
);
