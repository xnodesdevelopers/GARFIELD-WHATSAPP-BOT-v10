const _0x54311d=_0x17ec;(function(_0xc6cf28,_0x28fe3b){const _0x535fcb=_0x17ec,_0x4a0a60=_0xc6cf28();while(!![]){try{const _0x574dce=-parseInt(_0x535fcb(0x177))/0x1*(-parseInt(_0x535fcb(0x181))/0x2)+-parseInt(_0x535fcb(0x13a))/0x3+parseInt(_0x535fcb(0x13f))/0x4*(-parseInt(_0x535fcb(0x183))/0x5)+parseInt(_0x535fcb(0x173))/0x6+parseInt(_0x535fcb(0x162))/0x7+parseInt(_0x535fcb(0x144))/0x8+-parseInt(_0x535fcb(0x172))/0x9*(parseInt(_0x535fcb(0x138))/0xa);if(_0x574dce===_0x28fe3b)break;else _0x4a0a60['push'](_0x4a0a60['shift']());}catch(_0x49f8c9){_0x4a0a60['push'](_0x4a0a60['shift']());}}}(_0x1d8b,0xc4057));const {cmd}=require(_0x54311d(0x143)),ytdl=require(_0x54311d(0x184)),playdl=require(_0x54311d(0x164)),fs=require('fs'),path=require(_0x54311d(0x157)),ffmpeg=require(_0x54311d(0x133)),storeDir=_0x54311d(0x163);!fs['existsSync'](storeDir)&&fs['mkdirSync'](storeDir);const cookies=[{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':'GPS','path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':'1'},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x18a),'path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x54311d(0x192)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x17a),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':'kWji5hM-46c'},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':'VISITOR_PRIVACY_METADATA','path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x54311d(0x193)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x12e),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x165)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':'__Secure-ROLLOUT_TOKEN','path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x54311d(0x18d)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x141),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x179)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x14e),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':'sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA'},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x12c),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x176)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':'HSID','path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x148)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x12d),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x15c)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x161),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x174)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x180),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x15a)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x15f),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x15a)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x160),'path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x54311d(0x15a)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':'SID','path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x15b)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x15d),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':'g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiY73neOHnACBcva_antC0pogACgYKAbsSARASFQHGX2Mi7xANfiijeaFYl-6Q7aXmeRoVAUF8yKqcyKmUuiMu3B9OBbg0A-dQ0076'},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x17c),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x169)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x13b),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x131)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x188),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x171)},{'domain':'.youtube.com','hostOnly':![],'httpOnly':!![],'name':'__Secure-1PSIDCC','path':'/','sameSite':'no_restriction','secure':!![],'session':![],'value':_0x54311d(0x18e)},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':'__Secure-3PSIDCC','path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':'AKEyXzXA3n2KWC-da2yAC8i0qGKsuKsKn_VYQQY7PCMvCYKwXJhsqF2WMkCdTsFPB1FeNk6sMw'},{'domain':_0x54311d(0x16e),'hostOnly':![],'httpOnly':!![],'name':_0x54311d(0x190),'path':'/','sameSite':_0x54311d(0x16a),'secure':!![],'session':![],'value':_0x54311d(0x17b)}],agent=ytdl[_0x54311d(0x14c)](cookies),ytdlOptions={'headers':{'User-Agent':_0x54311d(0x134),'Accept':_0x54311d(0x145),'Accept-Language':_0x54311d(0x17e)},'agent':agent},handleErrors=(_0x3388d0,_0x26a086)=>_0xeb5e5a=>{const _0x19f353=_0x54311d;console[_0x19f353(0x142)](_0xeb5e5a),_0x3388d0(_0x26a086);},searchVideo=async _0x2ce1c4=>{const _0x473e48=_0x54311d;try{const _0xa448ed=await playdl[_0x473e48(0x178)](_0x2ce1c4,{'limit':0x1});return _0xa448ed[0x0];}catch(_0x5271f4){return console[_0x473e48(0x142)](_0x473e48(0x153),_0x5271f4),null;}},downloadAndConvertAudio=async(_0x1da55b,_0x3b2fa9,_0xba875f,_0x4af0fe,_0x278820,_0x25025c)=>{const _0xc4b142=_0x54311d;try{const _0x472edc=_0x3b2fa9['replace'](/[^a-zA-Z0-9]/g,'_'),_0x371dc0=path[_0xc4b142(0x18f)](storeDir,_0x472edc+_0xc4b142(0x158)),_0x5ef43a=path['join'](storeDir,_0x472edc+_0xc4b142(0x156)),_0x2b5b25=await ytdl[_0xc4b142(0x152)](_0x1da55b,ytdlOptions),_0x2cf42c=ytdl['filterFormats'](_0x2b5b25['formats'],_0xc4b142(0x12f))['find'](_0x2bac96=>_0x2bac96[_0xc4b142(0x16b)]===_0xc4b142(0x195));if(!_0x2cf42c)return _0xba875f(_0xc4b142(0x14b));const _0x57d261=ytdl[_0xc4b142(0x196)](_0x2b5b25,{'quality':_0x2cf42c[_0xc4b142(0x16c)],...ytdlOptions});await new Promise((_0x4ccc3e,_0x1f7e86)=>{const _0x229bd4=_0xc4b142;_0x57d261['pipe'](fs[_0x229bd4(0x147)](_0x371dc0))['on'](_0x229bd4(0x132),_0x4ccc3e)['on'](_0x229bd4(0x142),_0x1f7e86);}),await new Promise((_0x2290ad,_0x62b031)=>{const _0x477f49=_0xc4b142;ffmpeg(_0x371dc0)['output'](_0x5ef43a)[_0x477f49(0x146)](_0x477f49(0x135))[_0x477f49(0x140)]()['on']('end',()=>{const _0x4c94ea=_0x477f49;console['log'](_0x4c94ea(0x14f)),_0x2290ad();})['on']('error',_0x30176e=>{const _0x2ffa19=_0x477f49;console[_0x2ffa19(0x142)](_0x2ffa19(0x194),_0x30176e),_0x62b031(_0x30176e);})['run']();}),await _0x4af0fe[_0xc4b142(0x15e)](_0x278820,{'audio':fs[_0xc4b142(0x168)](_0x5ef43a),'mimetype':'audio/mp4','fileName':_0x3b2fa9+_0xc4b142(0x156)},{'quoted':_0x25025c}),fs['unlinkSync'](_0x371dc0),fs['unlinkSync'](_0x5ef43a);}catch(_0x1bd61b){handleErrors(_0xba875f,_0xc4b142(0x150))(_0x1bd61b);}};function _0x17ec(_0x1ab37b,_0x2a38b4){const _0x1d8b25=_0x1d8b();return _0x17ec=function(_0x17ec51,_0x122b7a){_0x17ec51=_0x17ec51-0x12c;let _0x2161c5=_0x1d8b25[_0x17ec51];return _0x2161c5;},_0x17ec(_0x1ab37b,_0x2a38b4);}cmd({'pattern':_0x54311d(0x182),'react':'🎶','desc':_0x54311d(0x18b),'category':'main','use':_0x54311d(0x16f),'filename':__filename},async(_0x4ac80a,_0x11cc27,_0x1ef05e,{from:_0x572744,args:_0x23d62f,reply:_0x285a0f})=>{const _0x2ac41e=_0x54311d;try{const _0x1d8cdd=_0x23d62f[_0x2ac41e(0x18f)]('\x20');if(!_0x1d8cdd)return _0x285a0f(_0x2ac41e(0x154));_0x285a0f('```🔍\x20Searching\x20for\x20the\x20song...\x20🎵```');const _0x481183=await searchVideo(_0x1d8cdd);if(!_0x481183)return _0x285a0f(_0x2ac41e(0x155)+_0x1d8cdd+'\x22.');const _0x3b8c14=_0x2ac41e(0x197)+_0x481183['id'],_0xf0b371='*🎶\x20Song\x20Name*\x20-\x20'+_0x481183[_0x2ac41e(0x185)]+_0x2ac41e(0x186)+_0x481183[_0x2ac41e(0x14d)]+_0x2ac41e(0x189)+(_0x481183[_0x2ac41e(0x13d)]?.['toLocaleString']()||_0x2ac41e(0x166))+'\x0a*🎙️\x20Artist*\x20-\x20'+(_0x481183[_0x2ac41e(0x149)]?.[_0x2ac41e(0x136)]||_0x2ac41e(0x16d))+_0x2ac41e(0x170)+_0x481183[_0x2ac41e(0x185)]+_0x2ac41e(0x156);await _0x4ac80a[_0x2ac41e(0x15e)](_0x572744,{'image':{'url':_0x481183[_0x2ac41e(0x137)][0x0]['url']},'caption':_0xf0b371}),await downloadAndConvertAudio(_0x3b8c14,_0x481183[_0x2ac41e(0x185)],_0x285a0f,_0x4ac80a,_0x572744,_0x11cc27);}catch(_0x4dd76c){handleErrors(_0x285a0f,'❌\x20An\x20error\x20occurred\x20while\x20processing\x20your\x20request.\x20😢')(_0x4dd76c);}}),cmd({'pattern':_0x54311d(0x14a),'react':'🎥','desc':_0x54311d(0x151),'category':_0x54311d(0x130),'use':_0x54311d(0x175),'filename':__filename},async(_0xf2f8b3,_0x59df1c,_0x16710f,{from:_0x2c081d,args:_0x34f020,reply:_0xe930ee})=>{const _0x192522=_0x54311d;try{const _0x416ee8=_0x34f020[_0x192522(0x18f)]('\x20');if(!_0x416ee8)return _0xe930ee('❗️\x20Please\x20provide\x20a\x20video\x20name\x20or\x20keywords.\x20📝\x0aExample:\x20.video\x20Despacito');_0xe930ee(_0x192522(0x18c));const _0x4225eb=await searchVideo(_0x416ee8);if(!_0x4225eb)return _0xe930ee(_0x192522(0x155)+_0x416ee8+'\x22.');const _0x61b3d0=_0x192522(0x197)+_0x4225eb['id'],_0xaf0274=_0x192522(0x187)+_0x4225eb[_0x192522(0x185)]+'\x0a*🕜\x20Duration*\x20-\x20'+_0x4225eb[_0x192522(0x14d)]+'\x0a*👁️\x20Views*\x20-\x20'+(_0x4225eb['views']?.[_0x192522(0x17f)]()||_0x192522(0x166))+_0x192522(0x17d)+(_0x4225eb['channel']?.['name']||'Unknown')+'\x0a',_0x2c5be5=_0x4225eb[_0x192522(0x185)][_0x192522(0x13e)](/[^a-zA-Z0-9]/g,'_'),_0x51929c=_0x192522(0x13c)+_0x2c5be5+_0x192522(0x158),_0x53f494=await ytdl[_0x192522(0x152)](_0x61b3d0,ytdlOptions),_0x507544=ytdl[_0x192522(0x159)](_0x53f494[_0x192522(0x139)],_0x192522(0x12f))['find'](_0x3ddd3a=>_0x3ddd3a[_0x192522(0x16b)]==='360p');if(!_0x507544)return _0xe930ee(_0x192522(0x14b));const _0x30b597=ytdl[_0x192522(0x196)](_0x53f494,{'quality':_0x507544[_0x192522(0x16c)],...ytdlOptions});await new Promise((_0x3ed860,_0x112921)=>{const _0xa7b95b=_0x192522;_0x30b597['pipe'](fs[_0xa7b95b(0x147)](_0x51929c))['on'](_0xa7b95b(0x132),_0x3ed860)['on']('error',_0x112921);}),await _0xf2f8b3[_0x192522(0x15e)](_0x2c081d,{'video':fs[_0x192522(0x168)](_0x51929c),'mimetype':_0x192522(0x167),'caption':_0xaf0274},{'quoted':_0x59df1c}),fs[_0x192522(0x191)](_0x51929c);}catch(_0x2d1c25){handleErrors(_0xe930ee,_0x192522(0x150))(_0x2d1c25);}});function _0x1d8b(){const _0x364750=['video','❌\x20No\x20suitable\x20video\x20format\x20found.\x20😢','createAgent','durationRaw','__Secure-1PSIDTS','Audio\x20conversion\x20finished','❌\x20An\x20error\x20occurred\x20while\x20processing\x20your\x20request.\x20😢','Download\x20YouTube\x20video\x20by\x20searching\x20for\x20keywords.','getInfo','Error\x20searching\x20for\x20video:','❗️\x20Please\x20provide\x20a\x20song\x20name\x20or\x20keywords.\x20📝\x0aExample:\x20.song\x20Despacito','❌\x20No\x20results\x20found\x20for\x20\x22','.m4a','path','.mp4','filterFormats','J1wJB-TTB_O1T1bz/ArUngcXeb5Lg23UV8','g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYfRYpcvrkI-rzRGjP4ZDdYQACgYKAWUSARASFQHGX2Miw5ynhZI9ppnxfwk7v_q1yBoVAUF8yKq_hWCBWFQeCOF9DvdprxRs0076','AZ3oqx3AE_htMgthf','__Secure-1PSID','sendMessage','__Secure-1PAPISID','__Secure-3PAPISID','APISID','10446366xGzYQt','./store','play-dl','tz=Asia.Colombo','N/A','video/mp4','readFileSync','g.a000uwhqAz4_4jGFZcHis_8dgITEr_fZi7txJu9ftRlW0Z6sAiiYpJp6Tt6olvXaizeuoTb0RgACgYKAaISARASFQHGX2MiXZSXai3QW0q6PbNUg9H_yhoVAUF8yKr0HTbFVhMrFOYmdTGecwmp0076','no_restriction','qualityLabel','itag','Unknown','.youtube.com','.song\x20<song\x20name\x20or\x20keywords>','\x0a>\x20File\x20Name\x20','AKEyXzUXL3M5ifARD-ktGih8aQLKjQcJxcCnezvnZkziU27keQC4gHYohJFd-e9G5wwb3r5E','747ebVXNt','1659666LAQjCp','-8C0h6WF6tMjTvcs/ARG0k-KxYXbfEQnot','.video\x20<video\x20name\x20or\x20keywords>','sidts-CjEBEJ3XV9QRg_PvQM69cRbzx9cK2ra5aqmvHLSXRCsuFZrsVNOVOTvttA9BMfApOmSiEAA','251026aPDnrt','search','ANPz9KgP1uSD2+uRBCHE/fBE9O4y3IphvPueiDZ1hf0jDEP71ue9wOYwI5kl6vgSueilJeGbcpLogCpQBPQY64V0wJN9mc8Fn7XiuCPZWAdOasg/gI9KjEqetmAgJtMfmlDFv1YvUIFMqFM8yx1OCq3hPj8j5Ji7QC4jZnCdBSq9GOjKkCzmjCWGqBJHK/w/vVSGhF/S6+zxLkvVcvYeSINL1B9hZurc0VPBGXEvVh/mwGhf89tSoY7prsryGdbXl8ZtyWuBSeh8H6FgBAdla834hGQNmvxyDt42eczUOc+hDaRIJ7U4OpJuDmoEUkWDU76XJWlB05sxQSXV+Hprh8YsDsLcqfCF411+pWVTLl8','VISITOR_INFO1_LIVE','csn=97RlpxVlHs01br0r&itct=CCoQ_FoiEwj6qpLg1oiMAxXqY50JHVh_A5AyCmctaGlnaC1yZWNaD0ZFd2hhdF90b193YXRjaJoBBhCOHhieAQ%3D%3D','__Secure-3PSID','\x0a*👤\x20Author*\x20-\x20','en-US,en;q=0.9','toLocaleString','SAPISID','8ctmXvW','song','395rhzqCn','@distube/ytdl-core','title','\x0a*🕜\x20Duration*\x20-\x20','*🎬\x20Video\x20Title*\x20-\x20','SIDCC','\x0a*📻\x20Listeners*\x20-\x20','YSC','Download\x20YouTube\x20audio\x20by\x20searching\x20for\x20keywords.','```🔍\x20Searching\x20for\x20the\x20video...\x20🎥```','CLaU152y-6fp3gEQtOzEjdaIjAMYn9zlt9aIjAM%3D','AKEyXzWM3YZJCYRgJeQKafe75_XUQf_4z6iRLKhqLyl9CpD6XNt75-ZfFAW3R09Ku9BVxOLz0w','join','ST-a4n57e','unlinkSync','OF3DmH4g2L4','CgJTRxIEGgAgIQ%3D%3D','FFmpeg\x20error:','360p','downloadFromInfo','https://www.youtube.com/watch?v=','__Secure-3PSIDTS','SSID','PREF','videoandaudio','main','AFmmF2swRQIhAOkHcIT_u0rmuInXWbtgazJB3eMqbTpE1S9OpMDjnNpDAiA-V1ObRnnbOtIAFgHQgx7wBB9Nq7rp-ZgUowax0ecmVQ:QUQ3MjNmeVM3MHR1NGZfYkVPbHYxOTMxNi1yWGREWHBlMHc3cHJsX25sZVdUY1IxSktsNi1mekJUVFhFNEdsZVNHbmJjOTJyblJCMWNoZVlKQUZlMXRPbzZxQ3duZ1FpbUU5Wi14XzFQQ2VNZHZ6TG9qdnJBSlAwbFJPOFlTdV9ZVFBhak94OVVQME0zUmY1R2Q0a3ZOeW9ISG1iRkRsSDR3','finish','fluent-ffmpeg','Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/120.0.0.0\x20Safari/537.36','copy','name','thumbnails','325420bLoTbg','formats','1379757brSpEe','LOGIN_INFO','./store/yt_video_','views','replace','10708vZuYJH','noVideo','YTSESSION-rvkia','error','../command','11217904AjyIdP','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8','audioCodec','createWriteStream','AmrtQhN3aX5kcbWfq','channel'];_0x1d8b=function(){return _0x364750;};return _0x1d8b();}
