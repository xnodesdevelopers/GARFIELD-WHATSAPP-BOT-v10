const { cmd } = require("../command");
const ytdl = require("@distube/ytdl-core");
const yts = require("yt-search");
const fs = require("fs");
const { promisify } = require("util");
const Bottleneck = require("bottleneck");

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

// Rate limiter
const limiter = new Bottleneck({
  minTime: 1000,
});

// Cookies array (empty since you fixed it)
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
  }];
const agent = ytdl.createAgent(cookies);

const ytdlOptions = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  },
  agent,
  requestOptions: {
    timeout: 30000, // 30 seconds timeout
  }
};

const ensureStoreDirectory = () => {
  if (!fs.existsSync('./store')) {
    fs.mkdirSync('./store', { recursive: true });
  }
};

// Audio Download Command
cmd(
  {
    pattern: "song",
    react: "🎶",
    desc: "Download YouTube audio quickly",
    category: "main",
    use: ".song <song name>",
    filename: __filename,
  },
  async (conn, mek, msg, { from, args, reply }) => {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return reply("❗️ Please provide a song name\nExample: .song Despacito");
      }

      await ensureStoreDirectory();
      const tempFileName = `./store/yt_audio_${Date.now()}.mp3`;

      // Search for the song
      reply("```🔍 Searching Song... 🎵```");
      const searchResults = await limiter.schedule(() => yts(searchQuery));
      
      if (!searchResults?.videos?.length) {
        return reply(`❌ No results found for "${searchQuery}"`);
      }

      const { title, duration, views, author, url: videoUrl, thumbnail: image } = searchResults.videos[0];
      const ytmsg = `*🎶 Song Name*: ${title}\n🕜 *Duration*: ${duration}\n📻 *Listeners*: ${views}\n🎙️ *Artist*: ${author.name}\n\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v10.1\n> File Name: ${title}.mp3`;

      // Send song details with thumbnail
      await conn.sendMessage(from, { image: { url: image }, caption: ytmsg }, { quoted: mek });

      // Get video info with retry mechanism
      let info;
      try {
        info = await limiter.schedule(() => 
          ytdl.getInfo(videoUrl, {
            ...ytdlOptions,
            requestOptions: {
              ...ytdlOptions.requestOptions,
              maxRetries: 3,
              backoff: { inc: 1000, max: 5000 }
            }
          })
        );
      } catch (infoError) {
        throw new Error(`Failed to get video info: ${infoError.message}`);
      }

      // Filter audio formats
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      const audioFormat = audioFormats.find(f => f.audioBitrate >= 128) || audioFormats[0];
      
      if (!audioFormat) {
        return reply("❌ No suitable audio format found");
      }

      // Download audio with improved streaming
      const audioStream = ytdl.downloadFromInfo(info, {
        format: audioFormat,
        quality: "highestaudio",
        highWaterMark: 1 << 25, // 32MB buffer
        liveBuffer: 4000,
        dlChunkSize: 1024 * 1024, // 1MB chunks
      });

      // Stream handling with timeout
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(tempFileName);
        audioStream.pipe(writeStream);

        const timeout = setTimeout(() => {
          audioStream.destroy();
          writeStream.destroy();
          reject(new Error("Download timeout after 60s"));
        }, 60000);

        writeStream.on("finish", () => {
          clearTimeout(timeout);
          resolve();
        });

        writeStream.on("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });

        audioStream.on("error", (err) => {
          clearTimeout(timeout);
          writeStream.destroy();
          reject(err);
        });
      });

      // Verify file exists and has content
      const stats = await fs.promises.stat(tempFileName);
      if (!stats.size) {
        throw new Error("Downloaded file is empty");
      }

      // Send audio
      await conn.sendMessage(
        from,
        {
          audio: { url: tempFileName },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          ptt: false
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error("Error:", e);
      reply(`❌ Error: ${e.message || "Failed to process audio download"}\nPlease try again`);
    } finally {
      // Cleanup
      const tempFileName = `./store/yt_audio_${Date.now()}.mp3`;
      if (fs.existsSync(tempFileName)) {
        await unlink(tempFileName).catch(e => console.error("Cleanup error:", e));
      }
    }
  }
);
