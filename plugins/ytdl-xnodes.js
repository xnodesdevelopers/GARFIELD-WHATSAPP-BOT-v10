const { cmd } = require("../command"); // Assuming you have a command handler
const ytdl = require("@distube/ytdl-core"); // For downloading YouTube videos
const playdl = require("play-dl"); // For searching YouTube videos
const fs = require("fs"); // For file system operations
const path = require("path"); // For path operations
const ffmpeg = require("fluent-ffmpeg"); // For audio conversion

// Ensure the ./store directory exists
const _0x46e23a=_0x2b51;(function(_0x56e152,_0x442f82){const _0x11f502=_0x2b51,_0x22d2dd=_0x56e152();while(!![]){try{const _0x18eeb8=-parseInt(_0x11f502(0x105))/0x1+-parseInt(_0x11f502(0x10b))/0x2+parseInt(_0x11f502(0x103))/0x3+-parseInt(_0x11f502(0x12e))/0x4+parseInt(_0x11f502(0x125))/0x5+parseInt(_0x11f502(0x124))/0x6*(-parseInt(_0x11f502(0x11e))/0x7)+-parseInt(_0x11f502(0x121))/0x8*(-parseInt(_0x11f502(0x111))/0x9);if(_0x18eeb8===_0x442f82)break;else _0x22d2dd['push'](_0x22d2dd['shift']());}catch(_0x20cc60){_0x22d2dd['push'](_0x22d2dd['shift']());}}}(_0x5a12,0xefbac));const cookies=[{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x126),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':'1'},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x109),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x107)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x117),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x123)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x108),'path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x46e23a(0x120)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x12b),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x10d)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':'__Secure-ROLLOUT_TOKEN','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x104)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x118),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':'ANPz9KgP1uSD2+uRBCHE/fBE9O4y3IphvPueiDZ1hf0jDEP71ue9wOYwI5kl6vgSueilJeGbcpLogCpQBPQY64V0wJN9mc8Fn7XiuCPZWAdOasg/gI9KjEqetmAgJtMfmlDFv1YvUIFMqFM8yx1OCq3hPj8j5Ji7QC4jZnCdBSq9GOjKkCzmjCWGqBJHK/w/vVSGhF/S6+zxLkvVcvYeSINL1B9hZurc0VPBGXEvVh/mwGhf89tSoY7prsryGdbXl8ZtyWuBSeh8H6FgBAdla834hGQNmvxyDt42eczUOc+hDaRIJ7U4OpJuDmoEUkWDU76XJWlB05sxQSXV+Hprh8YsDsLcqfCF411+pWVTLl8'},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':'__Secure-1PSIDTS','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':'sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA'},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x127),'path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x46e23a(0x116)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x128),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x112)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':'SSID','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':'AZ3oqx3AE_htMgthf'},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':'APISID','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x12a)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x114),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x11f)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x12c),'path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x46e23a(0x11f)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':'__Secure-3PAPISID','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x11f)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x110),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x11c)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x11a),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x113)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':'__Secure-3PSID','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x122)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':'LOGIN_INFO','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x129)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x106),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x102)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':'__Secure-1PSIDCC','path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x12d)},{'domain':_0x46e23a(0x10c),'hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x10f),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':_0x46e23a(0x119)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x46e23a(0x11d),'path':'/','sameSite':_0x46e23a(0x10e),'secure':!![],'session':![],'value':'csn=97RlpxVlHs01br0r&itct=CCoQ_FoiEwj6qpLg1oiMAxXqY50JHVh_A5AyCmctaGlnaC1yZWNaD0ZFd2hhdF90b193YXRjaJoBBhCOHhieAQ%3D%3D'}],agent=ytdl[_0x46e23a(0x11b)](cookies),ytdlOptions={'headers':{'User-Agent':_0x46e23a(0x101),'Accept':_0x46e23a(0x10a),'Accept-Language':_0x46e23a(0x115)},'agent':agent};function _0x2b51(_0x49d853,_0x40bf94){const _0x5a123a=_0x5a12();return _0x2b51=function(_0x2b5142,_0x6849d3){_0x2b5142=_0x2b5142-0x101;let _0x1ff4e9=_0x5a123a[_0x2b5142];return _0x1ff4e9;},_0x2b51(_0x49d853,_0x40bf94);}function _0x5a12(){const _0x7efc38=['325410Ozjnqc','4338075ScMjEz','GPS','__Secure-3PSIDTS','HSID','AFmmF2swRQIhAOkHcIT_u0rmuInXWbtgazJB3eMqbTpE1S9OpMDjnNpDAiA-V1ObRnnbOtIAFgHQgx7wBB9Nq7rp-ZgUowax0ecmVQ:QUQ3MjNmeVM3MHR1NGZfYkVPbHYxOTMxNi1yWGREWHBlMHc3cHJsX25sZVdUY1IxSktsNi1mekJUVFhFNEdsZVNHbmJjOTJyblJCMWNoZVlKQUZlMXRPbzZxQ3duZ1FpbUU5Wi14XzFQQ2VNZHZ6TG9qdnJBSlAwbFJPOFlTdV9ZVFBhak94OVVQME0zUmY1R2Q0a3ZOeW9ISG1iRkRsSDR3','-8C0h6WF6tMjTvcs/ARG0k-KxYXbfEQnot','PREF','__Secure-1PAPISID','AKEyXzWM3YZJCYRgJeQKafe75_XUQf_4z6iRLKhqLyl9CpD6XNt75-ZfFAW3R09Ku9BVxOLz0w','4375040XGjmWh','Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/120.0.0.0\x20Safari/537.36','AKEyXzUXL3M5ifARD-ktGih8aQLKjQcJxcCnezvnZkziU27keQC4gHYohJFd-e9G5wwb3r5E','1408617TMEJYr','CLaU152y-6fp3gEQtOzEjdaIjAMYn9zlt9aIjAM%3D','2631YmZGna','SIDCC','OF3DmH4g2L4','VISITOR_PRIVACY_METADATA','YSC','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8','2456814xbEAwQ','.youtube.com','tz=Asia.Colombo','no_restriction','__Secure-3PSIDCC','SID','4581414HCdePr','AmrtQhN3aX5kcbWfq','g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiY73neOHnACBcva_antC0pogACgYKAbsSARASFQHGX2Mi7xANfiijeaFYl-6Q7aXmeRoVAUF8yKqcyKmUuiMu3B9OBbg0A-dQ0076','SAPISID','en-US,en;q=0.9','sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA','VISITOR_INFO1_LIVE','YTSESSION-rvkia','AKEyXzXA3n2KWC-da2yAC8i0qGKsuKsKn_VYQQY7PCMvCYKwXJhsqF2WMkCdTsFPB1FeNk6sMw','__Secure-1PSID','createAgent','g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYfRYpcvrkI-rzRGjP4ZDdYQACgYKAWUSARASFQHGX2Miw5ynhZI9ppnxfwk7v_q1yBoVAUF8yKq_hWCBWFQeCOF9DvdprxRs0076','ST-a4n57e','140BCZYco','J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8','CgJTRxIEGgAgIQ%3D%3D','48kIJDJI','g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYpJp6Tt6olvXaizeuoTb0RgACgYKAaISARASFQHGX2MiXZSXai3QW0q6PbNUg9H_yhoVAUF8yKr0HTbFVhMrFOYmdTGecwmp0076','kWji5hM-46c'];_0x5a12=function(){return _0x7efc38;};return _0x5a12();}
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
const downloadAndConvertAudio = async (videoUrl, title, reply, conn, from, mek) => { function _0x2889(_0x452173,_0x1c2469){const _0x21a716=_0x21a7();return _0x2889=function(_0x28891c,_0x41b618){_0x28891c=_0x28891c-0x107;let _0x38e6cb=_0x21a716[_0x28891c];return _0x38e6cb;},_0x2889(_0x452173,_0x1c2469);}const _0x400f01=_0x2889;(function(_0x4da5f9,_0x22882a){const _0x3e1e1e=_0x2889,_0x2fa1f1=_0x4da5f9();while(!![]){try{const _0x1a5fc4=parseInt(_0x3e1e1e(0x119))/0x1*(parseInt(_0x3e1e1e(0x11b))/0x2)+-parseInt(_0x3e1e1e(0x122))/0x3*(parseInt(_0x3e1e1e(0x11a))/0x4)+parseInt(_0x3e1e1e(0x107))/0x5*(parseInt(_0x3e1e1e(0x118))/0x6)+-parseInt(_0x3e1e1e(0x10f))/0x7*(-parseInt(_0x3e1e1e(0x11d))/0x8)+parseInt(_0x3e1e1e(0x11f))/0x9+parseInt(_0x3e1e1e(0x11c))/0xa+-parseInt(_0x3e1e1e(0x123))/0xb*(parseInt(_0x3e1e1e(0x12b))/0xc);if(_0x1a5fc4===_0x22882a)break;else _0x2fa1f1['push'](_0x2fa1f1['shift']());}catch(_0x137ac6){_0x2fa1f1['push'](_0x2fa1f1['shift']());}}}(_0x21a7,0xc88bc));try{const sanitizedTitle=title[_0x400f01(0x115)](/[^a-zA-Z0-9]/g,'_'),tempVideoFile=path[_0x400f01(0x10d)](storeDir,sanitizedTitle+_0x400f01(0x129)),tempAudioFile=path['join'](storeDir,sanitizedTitle+_0x400f01(0x111)),info=await ytdl[_0x400f01(0x12a)](videoUrl,ytdlOptions),videoFormat=ytdl[_0x400f01(0x116)](info[_0x400f01(0x113)],'videoandaudio')['find'](_0x53f999=>_0x53f999['qualityLabel']==='360p');if(!videoFormat)return reply(_0x400f01(0x126));const videoStream=ytdl[_0x400f01(0x12c)](info,{'quality':videoFormat[_0x400f01(0x121)],...ytdlOptions});await new Promise((_0x4dca19,_0xfe588f)=>{const _0x1818de=_0x400f01;videoStream[_0x1818de(0x10a)](fs[_0x1818de(0x109)](tempVideoFile))['on'](_0x1818de(0x10b),_0x4dca19)['on']('error',_0xfe588f);}),await new Promise((_0x1c6dda,_0x4008a7)=>{const _0x3a41b6=_0x400f01;ffmpeg(tempVideoFile)['output'](tempAudioFile)[_0x3a41b6(0x12d)](_0x3a41b6(0x110))[_0x3a41b6(0x120)]()['on'](_0x3a41b6(0x128),()=>{const _0x5b8755=_0x3a41b6;console[_0x5b8755(0x127)](_0x5b8755(0x10e)),_0x1c6dda();})['on'](_0x3a41b6(0x112),_0x3ef299=>{const _0x48405a=_0x3a41b6;console['error'](_0x48405a(0x124),_0x3ef299),_0x4008a7(_0x3ef299);})[_0x3a41b6(0x108)]();}),await conn[_0x400f01(0x11e)](from,{'audio':fs[_0x400f01(0x114)](tempAudioFile),'mimetype':_0x400f01(0x125),'fileName':title+'.m4a'},{'quoted':mek}),fs[_0x400f01(0x117)](tempVideoFile),fs[_0x400f01(0x117)](tempAudioFile);}catch(_0x51ba75){handleErrors(reply,_0x400f01(0x10c))(_0x51ba75);}function _0x21a7(){const _0x41ff27=['sendMessage','6293403UcVhpO','noVideo','itag','4448229QJdXKH','394031hFMHLd','FFmpeg\x20error:','audio/mp4','❌\x20No\x20suitable\x20video\x20format\x20found.\x20😢','log','end','.mp4','getInfo','1116yfrzJK','downloadFromInfo','audioCodec','1972955niJXVA','run','createWriteStream','pipe','finish','❌\x20An\x20error\x20occurred\x20while\x20processing\x20your\x20request.\x20😢','join','Audio\x20conversion\x20finished','4242CmqGxy','copy','.m4a','error','formats','readFileSync','replace','filterFormats','unlinkSync','24aCdjFr','439697ZngqDj','4TdDuuq','4kXzoWW','9362370CQEWuP','20360MzsAhN'];_0x21a7=function(){return _0x41ff27;};return _0x21a7();} };

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
