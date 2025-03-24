const{cmd:e}=require("../command"),ytdl=require("garfield-ytdl"),playdl=require("play-dl"),fs=require("fs"),path=require("path"),ffmpeg=require("fluent-ffmpeg"),storeDir="./store",cookies=[{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"YSC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"t_HmzTh5omc"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_INFO1_LIVE",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"rQ81apo74qM"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_PRIVACY_METADATA",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CgJHQhIEGgAgMA%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"PREF",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"tz=Asia.Colombo"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-ROLLOUT_TOKEN",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CJy5rYyd-e6DCBCBk-i18p2MAxihmPXB8p2MAw%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"HSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AZoFEL00JYN1EjeVz"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AIVBWQT0lhzYoed6H"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"APISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"msFZvYs46PCbe0XM/AXQnQe2WwVsYIdyOB"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhT0aibC6e-KAn2azhZKBdwAACgYKAT8SARASFQHGX2MirXYmvMJ34yDNTX8BEX6QJBoVAUF8yKov3c7wb1XegdJRXhLVkl0c0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vh6PPomyhFWultXkoWQ1OznwACgYKAWkSARASFQHGX2MiM057HufCvNlCcbz7Y2PVeRoVAUF8yKpqaovc1I792nnpWfTE5KpQ0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhqunIOQAT6uUunqYLHsyrbAACgYKAfgSARASFQHGX2MiNYwW06M73dI9M3pX8hUwfxoVAUF8yKreaeDdJ2fc5Va_fo4Y-Fj10076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"LOGIN_INFO",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AFmmF2swRgIhALi65i_2kwRwS0OF2bwTm3LgwhZDvK33oKmE6MRKpuBbAiEAwHIvg6Enp--kBFpdFI7JVR6iz_7CneQEur2uO0BJkOI:QUQ3MjNmd3JJeEZlZFhybm5NbU1sT1d4ZS1lTGw4ZWo4cmRYOFJhTUNjRWRNdXZHMHNqOUdFZ29nQk0xWkM0VHNkTXg5U1pjZTBLbV9yTklkS0JqQXRlOXU5cEN0a3N5SWgtSFZXX0Z1NzZxMzZOcnN0ckxRMHdBM0ZBVU9SWDQ4bllfcFY0cXJoZlBmcUF6dnA0WllUNnNuenNESGRMZXlB"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzUQrM4CeXqPxnvuEZoasevCZwF5RNljrlMokwr63JTv_uEsZM2BSgI_6FfEo4QwUwipKg"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzVsGgc5zmwR8yP3-druKM4KDVEMAtp9vep0aVeOLUXOwYVrHdDXr8fszTqDLt2Bn7ttHQ"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzUa_upGGImV0sOfhuk3fBva9kSfvQrH3a_Ova0gzk-GQ6-b-5g-89x_vrAftvlt5-cK5w"}],agent=ytdl.createAgent(cookies),ytdlOptions={headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","Accept-Language":"en-US,en;q=0.9"},agent:agent},handleErrors=(e,t)=>o=>{console.error(o),e(t)},searchVideo=async e=>{try{let t=await playdl.search(e,{limit:1});return t[0]}catch(o){return console.error("Error searching for video:",o),null}},downloadAndConvertAudio=async(e,t,o,n,a,i)=>{try{let s=t.replace(/[^a-zA-Z0-9]/g,"_"),r=path.join(storeDir,`${s}.mp4`),l=path.join(storeDir,`${s}.m4a`),u=await ytdl.getInfo(e,ytdlOptions),m=u.formats.find(e=>18===e.itag);if(!m)return o("❌ No suitable video format found for the specified itag. \uD83D\uDE22");let c=ytdl.downloadFromInfo(u,{format:m,...ytdlOptions});await new Promise((e,t)=>{c.pipe(fs.createWriteStream(r)).on("finish",e).on("error",t)}),await new Promise((e,t)=>{ffmpeg(r).output(l).audioCodec("copy").noVideo().on("end",()=>{console.log("Audio conversion finished"),e()}).on("error",e=>{console.error("FFmpeg error:",e),t(e)}).run()}),await n.sendMessage(a,{audio:fs.readFileSync(l),mimetype:"audio/mp4",fileName:`${s}.m4a`},{quoted:i}),fs.unlinkSync(r),fs.unlinkSync(l)}catch(d){handleErrors(o,"❌ An error occurred while processing your request. \uD83D\uDE22")(d)}};e({pattern:"song",react:"\uD83C\uDFB6",desc:"Download YouTube audio by searching for keywords.",category:"main",use:".song <song name or keywords>",filename:__filename},async(e,t,o,{from:n,args:a,reply:i})=>{try{let s=a.join(" ");if(!s)return i("❗️ Please provide a song name or keywords. \uD83D\uDCDD\nExample: .song Despacito");let r=await searchVideo(s);if(!r)return i(`❌ No results found for "${s}".`);let l=`https://www.youtube.com/watch?v=${r.id}`,u=`*🎶 Song Name* - ${r.title}
*🕜 Duration* - ${r.durationRaw}
*📻 Listeners* - ${r.views?.toLocaleString()||"N/A"}
*🎙️ Artist* - ${r.channel?.name||"Unknown"}
> File Name ${r.title}.m4a`;await e.sendMessage(n,{image:{url:r.thumbnails[0].url},caption:u}),await downloadAndConvertAudio(l,r.title,i,e,n,t)}catch(m){handleErrors(i,"❌ An error occurred while processing your request. \uD83D\uDE22")(m)}}),e({pattern:"video",react:"\uD83C\uDFA5",desc:"Download YouTube video by searching for keywords.",category:"main",use:".video <video name or keywords>",filename:__filename},async(e,t,o,{from:n,args:a,reply:i})=>{try{let s=a.join(" ");if(!s)return i(`❗️ Please provide a video name or keywords. 📝
Example: .video Despacito`);let r=await searchVideo(s);if(!r)return i(`❌ No results found for "${s}".`);let l=`https://www.youtube.com/watch?v=${r.id}`,u=`*🎬 Video Title* - ${r.title}
*🕜 Duration* - ${r.durationRaw}
*👁️ Views* - ${r.views?.toLocaleString()||"N/A"}
*👤 Author* - ${r.channel?.name||"Unknown"}
`,m=r.title.replace(/[^a-zA-Z0-9]/g,"_"),c=`./store/yt_video_${m}.mp4`,d=await ytdl.getInfo(l,ytdlOptions),p=d.formats.find(e=>18===e.itag);if(!p)return i("❌ No suitable video format found for the specified itag. \uD83D\uDE22");let y=ytdl.downloadFromInfo(d,{format:p,...ytdlOptions});await new Promise((e,t)=>{y.pipe(fs.createWriteStream(c)).on("finish",e).on("error",t)}),await e.sendMessage(n,{video:fs.readFileSync(c),mimetype:"video/mp4",caption:u},{quoted:t}),fs.unlinkSync(c)}catch(h){handleErrors(i,"❌ An error occurred while processing your request. \uD83D\uDE22")(h)}});
