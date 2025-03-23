const{cmd:e}=require("../command"),ytdl=require("@distube/ytdl-core"),playdl=require("play-dl"),fs=require("fs"),path=require("path"),ffmpeg=require("fluent-ffmpeg"),storeDir="./store",cookies=[{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"YSC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"t_HmzTh5omc"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_INFO1_LIVE",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"rQ81apo74qM"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_PRIVACY_METADATA",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CgJHQhIEGgAgMA%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"PREF",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"tz=Asia.Colombo"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-ROLLOUT_TOKEN",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CJy5rYyd-e6DCBCBk-i18p2MAxihmPXB8p2MAw%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"HSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AZoFEL00JYN1EjeVz"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AIVBWQT0lhzYoed6H"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"APISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"msFZvYs46PCbe0XM/AXQnQe2WwVsYIdyOB"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhT0aibC6e-KAn2azhZKBdwAACgYKAT8SARASFQHGX2MirXYmvMJ34yDNTX8BEX6QJBoVAUF8yKov3c7wb1XegdJRXhLVkl0c0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vh6PPomyhFWultXkoWQ1OznwACgYKAWkSARASFQHGX2MiM057HufCvNlCcbz7Y2PVeRoVAUF8yKpqaovc1I792nnpWfTE5KpQ0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhqunIOQAT6uUunqYLHsyrbAACgYKAfgSARASFQHGX2MiNYwW06M73dI9M3pX8hUwfxoVAUF8yKreaeDdJ2fc5Va_fo4Y-Fj10076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"LOGIN_INFO",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AFmmF2swRgIhALi65i_2kwRwS0OF2bwTm3LgwhZDvK33oKmE6MRKpuBbAiEAwHIvg6Enp--kBFpdFI7JVR6iz_7CneQEur2uO0BJkOI:QUQ3MjNmd3JJeEZlZFhybm5NbU1sT1d4ZS1lTGw4ZWo4cmRYOFJhTUNjRWRNdXZHMHNqOUdFZ29nQk0xWkM0VHNkTXg5U1pjZTBLbV9yTklkS0JqQXRlOXU5cEN0a3N5SWgtSFZXX0Z1NzZxMzZOcnN0ckxRMHdBM0ZBVU9SWDQ4bllfcFY0cXJoZlBmcUF6dnA0WllUNnNuenNESGRMZXlB"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzUQrM4CeXqPxnvuEZoasevCZwF5RNljrlMokwr63JTv_uEsZM2BSgI_6FfEo4QwUwipKg"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzVsGgc5zmwR8yP3-druKM4KDVEMAtp9vep0aVeOLUXOwYVrHdDXr8fszTqDLt2Bn7ttHQ"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzUa_upGGImV0sOfhuk3fBva9kSfvQrH3a_Ova0gzk-GQ6-b-5g-89x_vrAftvlt5-cK5w"}],agent=ytdl.createAgent(cookies),ytdlOptions={headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","Accept-Language":"en-US,en;q=0.9"},agent:agent},handleErrors=(e,t)=>o=>{console.error(o),e(t)},searchVideo=async e=>{try{let t=await playdl.search(e,{limit:1});return t[0]}catch(o){return console.error("Error searching for video:",o),null}},downloadAndConvertAudio=async(e,t,o,n,s,a)=>{try{let i=t.replace(/[^a-zA-Z0-9]/g,"_"),r=path.join(storeDir,`${i}.mp4`),u=path.join(storeDir,`${i}.m4a`),l=await ytdl.getInfo(e,ytdlOptions),m=l.formats.find(e=>18===e.itag);if(!m)return o("❌ No suitable video format found for the specified itag. \uD83D\uDE22");let c=ytdl.downloadFromInfo(l,{format:m,...ytdlOptions});await new Promise((e,t)=>{c.pipe(fs.createWriteStream(r)).on("finish",e).on("error",t)}),await new Promise((e,t)=>{ffmpeg(r).output(u).audioCodec("copy").noVideo().on("end",()=>{console.log("Audio conversion finished"),e()}).on("error",e=>{console.error("FFmpeg error:",e),t(e)}).run()}),await n.sendMessage(s,{document:fs.readFileSync(u),mimetype:"audio/mp4",fileName:`${i}.m4a`},{quoted:a}),fs.unlinkSync(r),fs.unlinkSync(u)}catch(p){handleErrors(o,"❌ An error occurred while processing your request. \uD83D\uDE22")(p)}};e({pattern:"play",react:"\uD83C\uDFB6",desc:"Download YouTube audio by searching for keywords.",category:"main",use:".song <song name or keywords>",filename:__filename},async(e,t,o,{from:n,args:s,reply:a})=>{try{let i=s.join(" ");if(!i)return a("❗️ Please provide a song name or keywords. \uD83D\uDCDD\nExample: .song Despacito");let r=await searchVideo(i);if(!r)return a(`❌ No results found for "${i}".`);let u=`https://www.youtube.com/watch?v=${r.id}`;await a(`_Downloading...._
*${r.title}* 
High Quality From Using *Youtube Music*`),await downloadAndConvertAudio(u,r.title,a,e,n,t)}catch(l){handleErrors(a,"❌ An error occurred while processing your request. \uD83D\uDE22")(l)}});
