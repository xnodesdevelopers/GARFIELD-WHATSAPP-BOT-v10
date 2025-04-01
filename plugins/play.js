const{cmd:e}=require("../command"),{execFileSync:r}=require("child_process"),fs=require("fs"),path=require("path"),playdl=require("play-dl"),PYTHON_PATH="win32"===process.platform?"python":"python3",PYTHON_SCRIPT=path.join(__dirname,"../lib/ytdls.py"),cleanFilename=e=>e.replace(/[^a-zA-Z0-9_-]/g,"_"),downloadMedia=async e=>{try{let a=[PYTHON_SCRIPT,e],t=r(PYTHON_PATH,a,{maxBuffer:209715200}).toString().trim();console.log(`Raw Python output: ${t}`);let o;try{o=JSON.parse(t)}catch(i){console.error(`JSON parse error: ${i.message}`);let n=t.match(/\/root\/GARFIELD-WHATSAPP-BOT-v10\/lib\/store\/[^\s]+\.m4a/)?.[0];if(n&&fs.existsSync(n))return console.log(`File found despite JSON error: ${n}`),{success:!0,filename:n,title:"Unknown (JSON parse failed)",duration:0};return{success:!1,error:`Invalid JSON output: ${t}`}}return o}catch(s){return console.error("Python execution error:",s),{success:!1,error:`Python execution failed: ${s.message}`}}},searchVideo=async e=>{try{let r=await playdl.search(e,{limit:5});return r[0]}catch(a){return console.error("Search error:",a),null}};e({pattern:"play",react:"\uD83C\uDFB6",desc:"Download YouTube audio as m4a",category:"main",use:".song <query>",filename:__filename},async(e,r,a,{from:t,args:o,reply:i})=>{try{let n=o.join(" ");if(!n)return i("Please provide a search query");let s=await searchVideo(n);if(!s)return i("No results found");await i(`_Downloading...._
*${s.title}*
High Quality From Using *Youtube Music*`);let l=await downloadMedia(`https://youtu.be/${s.id}`);if(!l.success)return i(`❌ Download failed: ${l.error}`);let c=fs.statSync(l.filename);if(0===c.size)return fs.unlinkSync(l.filename),i("❌ Downloaded file is empty");await e.sendMessage(t,{audio:fs.readFileSync(l.filename),mimetype:"audio/mp4",fileName:`${s.title}.m4a`},{quoted:r}),fs.unlinkSync(l.filename)}catch(u){console.error(u),i("❌ An error occurred while processing the audio")}}),module.exports={downloadMedia,searchVideo};
