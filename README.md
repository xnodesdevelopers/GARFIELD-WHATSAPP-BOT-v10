# ＧＡＲＦＩＥＬＤ ᴬᴵ ＢＯＴｖ10 🚀  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  
[![Version](https://img.shields.io/badge/Version-v10.0-green.svg)](https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/releases)  
[![GitHub Stars](https://img.shields.io/github/stars/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10?style=social)](https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/stargazers)  
[![GitHub Forks](https://img.shields.io/github/forks/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10?style=social)](https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/network/members)  

<p align="center">
  <img src="https://github.com/Zenoixnoize/GARFIELD-WHATSAPP-BOT-v8/blob/asdf/Cloud/PicsArt_22-04-17_16-25-53-440.png" width="500">
</p>
<p align="center">
  <img src="https://github.com/Zenoixnoize/GARFIELD-WHATSAPP-BOT-v8/blob/asdf/Cloud/PicsArt_22-04-15_10-13-49-205.png" width="500">
</p>

---

## Introduction  
**GARFIELD-WHATSAPP-BOT-v10** is a cutting-edge WhatsApp bot designed to revolutionize your messaging experience. Developed by **Xnodes Development** and coded by **Tharindu Liyanage**, this bot combines advanced AI capabilities with user-friendly features to deliver a seamless and interactive experience. Whether you're managing groups, automating replies, or exploring voice commands, **GARFIELD BOT v10** has you covered!  

<br>

<p align="left">
  <img src="https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/blob/master/lib/Picsart_25-01-30_13-20-39-871.jpg" width="500">
</p>

---

## Key Highlights 🌟  
- **Advanced AI Integration:** Leverage the power of Neural AI and සිංහල AI for intelligent conversations. 🤖  
- **Multi-Platform Support:** Works seamlessly on WhatsApp with plans for expansion to other platforms. 📱  
- **Customizable Features:** Tailor the bot to your needs with custom commands and configurations. 🛠️  
- **Open Source:** Fully open-source, allowing developers to contribute and enhance the bot. 💻  
- **Multi-Language Support:** Chat in multiple languages, including Sinhala, English, and more. 🌍  
- **Real-Time Updates:** Stay updated with real-time notifications and alerts. 🔔  
- **Security Features:** End-to-end encryption for secure conversations. 🔒  

---

## Features ✨  
- **Automated Replies:** Customizable automated replies to common messages. 🤖  
- **Media Support:** Send and receive images, videos, and documents. 📷🎥📄  
- **Group Management:** Efficiently manage WhatsApp groups with various admin features. 👥🔧  
- **APIs Integration:** Integration with multiple APIs for extended functionalities. 🔗  
- **Voice Replies:** Support for voice commands using Google TTS API. 🎤  
- **Custom Commands:** Easily add and configure custom commands. 🛠️  
- **Neural AI Chat:** Engage in intelligent conversations with the bot. 🧠  
- **සිංහල AI Support:** Chat in Sinhala with localized AI responses. 🇱🇰  
- **Sticker Creation:** Create custom stickers from images. 🖼️  
- **Weather Updates:** Get real-time weather updates for any location. 🌦️  
- **Reminders:** Set reminders for important tasks and events. ⏰  
- **Entertainment:** Play games, get jokes, and more for fun interactions. 🎮😂  

---

## Installation 🛠️  
To get started with **GARFIELD BOT v10**, follow these steps:  

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10.git
   cd GARFIELD-WHATSAPP-BOT-v10
   ```

2. **Install dependencies:**  
   ```bash
   npm install
   ```

3. **Configure the bot:**  
   Update the `config.js` file with your WhatsApp credentials and API keys. 🔑  

---

## Editing `config.js` 🔧  
1. Open the `config.js` file in your preferred text editor.  
2. Replace the placeholder values with your actual credentials and API keys.  
3. Save the changes and close the file.  

```javascript
module.exports = {
SESSION_ID: "Xnodes~ Your Session ID",
AUTO_STATUS_SEEN: true,  // Set to true or false for auto-seeing status
AUTO_STATUS_REPLY: true,  // Set to true if you want to auto-reply to status
AUTO_STATUS_REACT: true,  // Set to true if you want to auto-react to status
AUTO_STATUS_MSG: "Your custom auto-reply message here",  // Set the auto-reply message for status replies
PREFIX: ".",  // Add your prefix for the bot
BOT_NAME: "Your bot name",  // Add bot name for the menu
STICKER_NAME: "Sticker Pack Name",  // Set the sticker pack name
CUSTOM_REACT: false,  // Set to true for custom emoji reactions
CUSTOM_REACT_EMOJIS: "⭐",  // Choose custom react emojis
DELETE_LINKS: false,  // Set to true for automatic deletion of links without removing members
OWNER_NUMBER: "Your phone number here",  // Add your bot owner number
OWNER_NAME: "Your name here",  // Add bot owner name
DESCRIPTION: "Your bot description here",  // Add bot description
ALIVE_IMG: "Image URL here",  // Add image URL for the alive message
LIVE_MSG: "Your alive message here",  // Add alive message
READ_MESSAGE: true,  // Set to true or false for automatic reading of messages
AUTO_REACT: true,  // Set to true or false for auto-reactions to all messages
ANTI_BAD: false,  // Set to true for anti-bad words filter
MODE: "public",  // Set the bot mode to public, private, inbox, or group
ANTI_LINK: false,  // Set to true for anti-link protection in groups
AUTO_VOICE: false,  // Set to true for sending automatic voices
AUTO_STICKER: false,  // Set to true for sending automatic stickers
AUTO_REPLY: false,  // Set to true for automatic text replies
ALWAYS_ONLINE: true,  // Set to true for always being online
PUBLIC_MODE: true,  // Set to false for private mode
AUTO_TYPING: false,  // Set to true for automatic "typing" display
READ_CMD: false,  // Set to true to mark commands as read
DEV: "Your WhatsApp number here",  // Replace with your WhatsApp number
ANTI_VV: true,  // Set to true for anti-once view
ANTI_DEL_PATH: "log",  // Change to 'same' if you want to resend deleted messages in the same chat
AUTO_RECORDING: false  // Set to true for automatic recording
};
```

4. **Run the bot:**  
   ```bash
   node index.js
   ```

---

## Hosting 🌐  
Deploy your bot using one of these popular hosting services:  

<a href="https://heroku.com/deploy" style="display:inline-block;margin:10px;"><img src="https://img.shields.io/badge/Deploy-Heroku-purple.svg?logo=heroku" style="height:50px;"></a>  
<a href="https://panel.io/deploy" style="display:inline-block;margin:10px;"><img src="https://img.shields.io/badge/Deploy-Panel-red.svg?logo=panel" style="height:50px;"></a>  
<a href="https://app.koyeb.com/deploy" style="display:inline-block;margin:10px;"><img src="https://img.shields.io/badge/Deploy-Koyeb-blue.svg?logo=koyeb" style="height:50px;"></a>  

---

## Click to Pair Device  
[![Pair Device](https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/blob/master/lib/Picsart_25-02-10_09-45-58-194.png)](https://confidential-randee-xnodesdves-d676b79b.koyeb.app/)  

---

## Neural AI and සිංහල AI Chat Feature  
<p align="center">
  <img src="https://camo.githubusercontent.com/4ccb106355cfba7541b707fac4319477a694ed180228df23b1c9325994e5841e/68747470733a2f2f692e6962622e636f2f54634c56664d5a2f506963736172742d32322d30382d32322d31352d32312d34312d3137352e706e67" width="500">
</p>  

---

## Usage 📲  
Once the bot is up and running, you can interact with it through WhatsApp by sending commands and messages. Here are some examples:  

- **Automated Replies:** Send "Hi" to receive an automated greeting message. 👋  
- **Send Media:** Send an image to receive an automated response with a caption. 🖼️  
- **Voice Replies:** Say "Hi" to trigger a voice response. 🗣️  
- **Get Menu:** Send `.menu` or `.allmenu` to receive the bot's command menu. 📜  
- **AI Chat:** Engage in intelligent conversations with the bot using `.ai`. 🧠  
- **Weather Updates:** Send `.weather [location]` to get the current weather. 🌦️  
- **Set Reminders:** Use `.remind [time] [task]` to set a reminder. ⏰  
- **Play Games:** Send `.game` to start a fun game. 🎮  

---

## Contributing 💡  
We welcome contributions from the community! If you would like to contribute, please follow these steps:  

1. Fork the repository. 🍴  
2. Create a new branch (`git checkout -b feature-branch`). 🌿  
3. Make your changes and commit them (`git commit -m 'Add new feature'`). ✨  
4. Push to the branch (`git push origin feature-branch`). 🚀  
5. Open a pull request. 🔄  

---

## License 📜  
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  

---

## Acknowledgements 🙌  
- **Xnodes Development Team** for their continuous support and innovation.  
- **Tharindu Liyanage** for coding and maintaining the bot.  
- All contributors and users who have supported the project.  

---

## Developer  
**Xnodes Development** 👨‍💻👩‍💻  

---

## Coded by  
**Tharindu Liyanage** 👾  

---

## Developer 
<h4>Tharindu Liyanage</h4>
<img src="https://raw.githubusercontent.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/refs/heads/master/data/BeautyPlus_20250311204912624_save.png" alt="Profile Photo" width="300">

**I am Tharindu Liyanage (Sanku)**  
- **Age:** 18  
- **Country:** Sri Lanka 🇱🇰  
- **Occupation:** ICT Student 🎓  
- **Role:** Developer at **Xnodes Development** 👨‍💻  

I am the lead developer of **GARFIELD AI BOT v10**, and through this project, I am committed to bringing a new dimension to WhatsApp bot technology. My work is included in this **repository**, and I warmly invite you to explore it and contribute to its growth.  

---

## Join the Community 🌐  
Join our community to stay updated, share ideas, and collaborate on exciting projects:  

- **Discord Server:** [Join Now](https://discord.gg/your-invite-link)  
- **Telegram Group:** [Join Now](https://t.me/your-invite-link)  
- **Follow on Twitter:** [Follow Us](https://twitter.com/your-handle)  

---

## Donate 💖  
If you find this project useful, consider supporting us with a donation:  

- **Buy Me a Coffee:** [Donate Here](https://buymeacoffee.com/your-handle)  
- **PayPal:** [Donate Here](https://paypal.me/your-handle)  

Your support helps us continue to improve and maintain the bot!  

---

## Roadmap 🗺️  
Here's what we have planned for the future:  

- **v10.1:** Enhanced AI capabilities with more languages and better context understanding.  
- **v10.2:** Integration with more APIs for additional functionalities.  
- **v10.3:** Improved user interface and experience.  
- **v10.4:** Expansion to other messaging platforms like Telegram and Facebook Messenger.  

---

## Feedback and Support 📣  
We value your feedback! If you have any suggestions or need support, please reach out:  

- **Email:** xnodesdevelopers@gmail.com  
- **GitHub Issues:** [Open an Issue](https://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10/issues)  

---

## Special Thanks 🙏  
A big thank you to all our users and contributors who have helped make **GARFIELD BOT v10** a success. Your support and feedback are invaluable!  

---

## Stay Connected 🔗  
Follow us on social media for the latest updates and announcements:  

- **Twitter:** [Follow Us](https://twitter.com/your-handle)  
- **Facebook:** [Like Us](https://facebook.com/your-handle)  
- **Instagram:** [Follow Us](https://instagram.com/your-handle)  

---

## Final Note ✍️  
Thank you for choosing **GARFIELD BOT v10**. We are excited to have you on board and look forward to your contributions and feedback. Let's revolutionize the way we interact with technology together!  

--- 

Let me know if you need further adjustments! 🚀
