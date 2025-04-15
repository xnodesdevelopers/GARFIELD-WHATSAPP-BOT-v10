const{cmd:e}=require("../command"),ytdl=require("@distube/ytdl-core"),playdl=require("play-dl"),fs=require("fs"),path=require("path"),ffmpeg=require("fluent-ffmpeg"),storeDir="./store",cookies=[{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"YSC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"8P5xypq0HNI"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_INFO1_LIVE",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"8zLOKUr7WwA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"VISITOR_PRIVACY_METADATA",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CgJHQhIEGgAgRQ%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"PREF",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"tz=Asia.Colombo"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEB7pHptZsuafLBTmLVdy2FgcGDQ8Y6q4SvnElAKMEJueaHjuqKMA5ukDVkLCwHiekJEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDTS",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"sidts-CjEB7pHptZsuafLBTmLVdy2FgcGDQ8Y6q4SvnElAKMEJueaHjuqKMA5ukDVkLCwHiekJEAA"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"HSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AFIknu3GL_fCIPVnE"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AA2YkDJ9WwJvrsL5b"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"APISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"5X31BXfVw-wreDgY/Au8TqwFud1oOlhRFS"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"T2YxYg4s1JPdUynU/AwgbdyH_mmbCYGRr4"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"T2YxYg4s1JPdUynU/AwgbdyH_mmbCYGRr4"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PAPISID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"T2YxYg4s1JPdUynU/AwgbdyH_mmbCYGRr4"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vQhqA7ss3wZHxXhgkYwCwTKNFD4pMT0pQIUdN8bnwh7smsEFUa8JI5nxY-Qf4xeZHw_dQgACgYKAWESARASFQHGX2MiUz43plcxXZ6RR23XiwsUjxoVAUF8yKqbu0XhRNinuBI_aaLvdFbX0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vQhqA7ss3wZHxXhgkYwCwTKNFD4pMT0pQIUdN8bnwh7smsEFzW0cYHFzRfBlZ2hf5Y52GQACgYKAT4SARASFQHGX2MisahmqIdNyShuPquAHu3XhRoVAUF8yKoZNE7iL7m3d8euhfEzCuGl0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSID",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"g.a000vQhqA7ss3wZHxXhgkYwCwTKNFD4pMT0pQIUdN8bnwh7smsEFGDDvADYM0VhwvDcPmt_HmAACgYKAVUSARASFQHGX2MitzLPw1G4OJiNzV_NXsqWfhoVAUF8yKrDwUSNQEzRZV9GtKwD0gNY0076"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"LOGIN_INFO",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AFmmF2swRAIgSQJmfCiB_EFPxBmaUg0B-KbwnwsT2L4EI74F8OgklLgCIF6XO3DvyKVixTuXui4rr8NrZmjLo-Jm_ckmXwBlcN8J:QUQ3MjNmelVNeFdEcmJZa2FnS21hM2N2UGZPaUs4ZjFaRTdRODhmVHZkWU93R0NuOFlfVVJRTnV3cUJ1QXdXQldzZkhPU0VUaXI3ckxVVGpxYXFpZkN4S3I5VThJX1pIaU9oS1dqbG1kRHhOR1RYU1hqNXlpaGM2aVZXZzdUNXJVTTN3YS01c0RWdkM1MkxIemxqTjBTd0VSdks4SURjVld3"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-ROLLOUT_TOKEN",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"CKe_3Z6Zg9uOJhCPj6y2jraMAxjj6ZuWoNmMAw%3D%3D"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"SIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzXxMbq1lPjW8DWtogfJzFS9g6EcMf6jzTLJlFQXl2jt3o-UlwGXMRbvuk8ug1QG2V7Piw"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-1PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzXHeXYh5puUV22ZTkyz3NVKoMNALOZp8B2trkpeR-MJFhw7DT1mnMEHd_toIn7hwBTD"},{domain:".youtube.com",hostOnly:!1,httpOnly:!0,name:"__Secure-3PSIDCC",path:"/",sameSite:"no_restriction",secure:!0,session:!1,value:"AKEyXzX_IO-zR-m0N2OCynKzVnsj8t714LF6lNQ3BzzfVZQrHdgwrmghcYNFhDW2Oq3rR6HC"}],agent=ytdl.createAgent(cookies),ytdlOptions={headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","Accept-Language":"en-US,en;q=0.9"},agent:agent},handleErrors=(e,t)=>o=>{console.error(o),e(t)},searchVideo=async e=>{try{let t=await playdl.search(e,{limit:1});return t[0]}catch(o){return console.error("Error searching for video:",o),null}};e({pattern:"video",react:"\uD83C\uDFA5",desc:"Download YouTube video by searching for keywords.",category:"main",use:".video <video name or keywords>",filename:__filename},async(e,t,o,{from:n,args:s,reply:a})=>{try{let i=s.join(" ");if(!i)return a(`❗️ Please provide a video name or keywords. 📝
Example: .video Despacito`);let r=await searchVideo(i);if(!r)return a(`❌ No results found for "${i}".`);let u=`https://www.youtube.com/watch?v=${r.id}`,m=`*🎬 Video Title* - ${r.title}
*🕜 Duration* - ${r.durationRaw}
*👁️ Views* - ${r.views?.toLocaleString()||"N/A"}
*👤 Author* - ${r.channel?.name||"Unknown"}
`,l=r.title.replace(/[^a-zA-Z0-9]/g,"_"),c=`./store/yt_video_${l}.mp4`,h=await ytdl.getInfo(u,ytdlOptions),y=ytdl.filterFormats(h.formats,"videoandaudio").find(e=>18===e.itag);if(!y)return a("❌ No suitable video format found. \uD83D\uDE22");let d=ytdl.downloadFromInfo(h,{quality:18,...ytdlOptions});await new Promise((e,t)=>{d.pipe(fs.createWriteStream(c)).on("finish",e).on("error",t)}),await e.sendMessage(n,{video:fs.readFileSync(c),mimetype:"video/mp4",caption:m},{quoted:t}),fs.unlinkSync(c)}catch(p){handleErrors(a,"❌ An error occurred while processing your request. \uD83D\uDE22")(p)}});
