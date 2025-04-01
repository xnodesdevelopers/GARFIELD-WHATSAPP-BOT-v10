const{cmd:e}=require("../command"),{execFileSync:r}=require("child_process"),fs=require("fs"),path=require("path"),playdl=require("play-dl"),PYTHON_PATH="win32"===process.platform?"python":"python3",PYTHON_SCRIPT=path.join(__dirname,"../lib/ytdls.py"),cleanFilename=e=>e.replace(/[^a-zA-Z0-9_-]/g,"_"),downloadMedia=async(e,a)=>{try{let t=[PYTHON_SCRIPT,e,a],o=r(PYTHON_PATH,t,{maxBuffer:52428800}).toString().trim();console.log(`Raw Python output: ${o}`);let n;try{n=JSON.parse(o)}catch(i){console.error(`JSON parse error: ${i.message}`);let l=o.match(/\/root\/GARFIELD-WHATSAPP-BOT-v10\/lib\/store\/[^\s]+\.(m4a|mp4)/)?.[0];if(l&&fs.existsSync(l))return console.log(`File found despite JSON error: ${l}`),{success:!0,filename:l,title:"Unknown (JSON parse failed)",duration:0};return{success:!1,error:`Invalid JSON output: ${o}`}}return n}catch(s){return console.error("Python execution error:",s),{success:!1,error:`Python execution failed: ${s.message}`}}},searchVideo=async e=>{try{let r=await playdl.search(e,{limit:5});return r[0]}catch(a){return console.error("Search error:",a),null}};e({pattern:"play",react:"\uD83C\uDFB6",desc:"Download YouTube audio as m4a",category:"main",use:".song <query>",filename:__filename},async(e,r,a,{from:t,args:o,reply:n})=>{try{let i=o.join(" ");if(!i)return n("Please provide a search query");let l=await searchVideo(i);if(!l)return n("No results found");await n(`_Downloading...._\n*${video.title}*\nHigh Quality From Using *Youtube Music*`);let s=await downloadMedia(`https://youtu.be/${l.id}`,"audio");if(!s.success)return n(`❌ Download failed: ${s.error}`);let c=fs.statSync(s.filename);if(0===c.size)return fs.unlinkSync(s.filename),n("❌ Downloaded file is empty");await e.sendMessage(t,{document:fs.readFileSync(s.filename),mimetype:"audio/mp4",caption:`*✅ Download complete!*`,fileName:`${l.title}.m4a`},{quoted:r}),fs.unlinkSync(s.filename)}catch(d){console.error(d),n("❌ An error occurred while processing the audio")}}),module.exports={downloadMedia,searchVideo};
