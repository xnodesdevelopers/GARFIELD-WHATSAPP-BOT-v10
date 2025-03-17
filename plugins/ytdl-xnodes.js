const{cmd:e}=require("../command"),ytdl=require("@distube/ytdl-core"),playdl=require("play-dl"),fs=require("fs"),path=require("path"),ffmpeg=require("fluent-ffmpeg"),storeDir="./store",cookies=[{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"YSC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"OF3DmH4g2L4"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_INFO1_LIVE",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"kWji5hM-46c"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_PRIVACY_METADATA",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CgJTRxIEGgAgIQ%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"PREF",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"tz=Asia.Colombo"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"HSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AmrtQhN3aX5kcbWfq"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AZ3oqx3AE_htMgthf"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"APISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"-8C0h6WF6tMjTvcs/ARG0k-KxYXbfEQnot"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYfRYpcvrkI-rzRGjP4ZDdYQACgYKAWUSARASFQHGX2Miw5ynhZI9ppnxfwk7v_q1yBoVAUF8yKq_hWCBWFQeCOF9DvdprxRs0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiY73neOHnACBcva_antC0pogACgYKAbsSARASFQHGX2Mi7xANfiijeaFYl-6Q7aXmeRoVAUF8yKqcyKmUuiMu3B9OBbg0A-dQ0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYpJp6Tt6olvXaizeuoTb0RgACgYKAaISARASFQHGX2MiXZSXai3QW0q6PbNUg9H_yhoVAUF8yKr0HTbFVhMrFOYmdTGecwmp0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"LOGIN_INFO",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AFmmF2swRQIhAOkHcIT_u0rmuInXWbtgazJB3eMqbTpE1S9OpMDjnNpDAiA-V1ObRnnbOtIAFgHQgx7wBB9Nq7rp-ZgUowax0ecmVQ:QUQ3MjNmeVM3MHR1NGZfYkVPbHYxOTMxNi1yWGREWHBlMHc3cHJsX25sZVdUY1IxSktsNi1mekJUVFhFNEdsZVNHbmJjOTJyblJCMWNoZVlKQUZlMXRPbzZxQ3duZ1FpbUU5Wi14XzFQQ2VNZHZ6TG9qdnJBSlAwbFJPOFlTdV9ZVFBhak94OVVQME0zUmY1R2Q0a3ZOeW9ISG1iRkRsSDR3"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-ROLLOUT_TOKEN",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CLaU152y-6fp3gEQtOzEjdaIjAMY86z4tomQjAM%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"ST-15ocjwv",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"csn=Tic6Q6pvux0Paqu4&itct=CJQBEP_QBSITCIvE_LaJkIwDFT1AnQkdITEQXDIYaG9tZXBhZ2VfbW9iaWxlX21hc3RoZWFkSP7HnNKsm5WnGQ%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzUN6QG_bcYoYzFRqk0PwgdnKEfll3CvZOfwJSX-0P0sAkY64oCMxHXIqB7fDF77a62K"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzVzbSlprAfIppGma0lsaSY-540bbWkymb85iOQ6pj9d7iln17ZWgLYtknMwZPyM3RV26A"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzWx8AanS5PMJu8ZMux0TJdnX-DtNkZdhKfRUqYL4ABJ4q3YlM_cObNBnsKoWD3Vab2CAg"}],agent=ytdl.createAgent(cookies),ytdlOptions={headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","Accept-Language":"en-US,en;q=0.9"},agent:agent},handleErrors=(e,t)=>o=>{console.error(o),e(t)},searchVideo=async e=>{try{let t=await playdl.search(e,{limit:1});return t[0]}catch(o){return console.error("Error searching for video:",o),null}},downloadAndConvertAudio=async(e,t,o,n,a,i)=>{try{let s=t.replace(/[^a-zA-Z0-9]/g,"_"),r=path.join(storeDir,`${s}.mp4`),l=path.join(storeDir,`${s}.m4a`),u=await ytdl.getInfo(e,ytdlOptions),c=ytdl.filterFormats(u.formats,"videoandaudio").find(e=>"360p"===e.qualityLabel);if(!c)return o("❌ No suitable video format found. \uD83D\uDE22");let m=ytdl.downloadFromInfo(u,{quality:c.itag,...ytdlOptions});await new Promise((e,t)=>{m.pipe(fs.createWriteStream(r)).on("finish",e).on("error",t)}),await new Promise((e,t)=>{ffmpeg(r).output(l).audioCodec("copy").noVideo().on("end",()=>{console.log("Audio conversion finished"),e()}).on("error",e=>{console.error("FFmpeg error:",e),t(e)}).run()}),await n.sendMessage(a,{audio:fs.readFileSync(l),mimetype:"audio/mp4",fileName:`${t}.m4a`},{quoted:i}),fs.unlinkSync(r),fs.unlinkSync(l)}catch(d){handleErrors(o,"❌ An error occurred while processing your request. \uD83D\uDE22")(d)}};e({pattern:"song",react:"\uD83C\uDFB6",desc:"Download YouTube audio by searching for keywords.",category:"main",use:".song <song name or keywords>",filename:__filename},async(e,t,o,{from:n,args:a,reply:i})=>{try{let s=a.join(" ");if(!s)return i("❗️ Please provide a song name or keywords. \uD83D\uDCDD\nExample: .song Despacito");let r=await searchVideo(s);if(!r)return i(`❌ No results found for "${s}".`);let l=`https://www.youtube.com/watch?v=${r.id}`,u=`*🎶 Song Name* - ${r.title}
*🕜 Duration* - ${r.durationRaw}
*📻 Listeners* - ${r.views?.toLocaleString()||"N/A"}
*🎙️ Artist* - ${r.channel?.name||"Unknown"}
> File Name ${r.title}.m4a`;await e.sendMessage(n,{image:{url:r.thumbnails[0].url},caption:u}),await downloadAndConvertAudio(l,r.title,i,e,n,t)}catch(c){handleErrors(i,"❌ An error occurred while processing your request. \uD83D\uDE22")(c)}}),e({pattern:"video",react:"\uD83C\uDFA5",desc:"Download YouTube video by searching for keywords.",category:"main",use:".video <video name or keywords>",filename:__filename},async(e,t,o,{from:n,args:a,reply:i})=>{try{let s=a.join(" ");if(!s)return i(`❗️ Please provide a video name or keywords. 📝
Example: .video Despacito`);let r=await searchVideo(s);if(!r)return i(`❌ No results found for "${s}".`);let l=`https://www.youtube.com/watch?v=${r.id}`,u=`*🎬 Video Title* - ${r.title}
*🕜 Duration* - ${r.durationRaw}
*👁️ Views* - ${r.views?.toLocaleString()||"N/A"}
*👤 Author* - ${r.channel?.name||"Unknown"}
`,c=r.title.replace(/[^a-zA-Z0-9]/g,"_"),m=`./store/yt_video_${c}.mp4`,d=await ytdl.getInfo(l,ytdlOptions),y=ytdl.filterFormats(d.formats,"videoandaudio").find(e=>"360p"===e.qualityLabel);if(!y)return i("❌ No suitable video format found. \uD83D\uDE22");let p=ytdl.downloadFromInfo(d,{quality:y.itag,...ytdlOptions});await new Promise((e,t)=>{p.pipe(fs.createWriteStream(m)).on("finish",e).on("error",t)}),await e.sendMessage(n,{video:fs.readFileSync(m),mimetype:"video/mp4",caption:u},{quoted:t}),fs.unlinkSync(m)}catch(h){handleErrors(i,"❌ An error occurred while processing your request. \uD83D\uDE22")(h)}});
