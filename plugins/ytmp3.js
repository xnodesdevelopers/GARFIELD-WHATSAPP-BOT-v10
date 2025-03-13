const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  try {
    if (url.includes('youtube.com/watch')) {
      return new URL(url).searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return '';
  } catch (error) {
    console.error('Error extracting video ID:', error.message);
    return '';
  }
}

cmd({
  pattern: "song",
  react: "🎵",
  desc: "Download YouTube audio using keywords or a direct URL.",
  category: "main",
  use: ".song <title or keywords>",
}, async (_action, _message, _args, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) {
      return await reply('*❌ Please provide a video name, keywords, or a YouTube URL!*');
    }
    
    // Notify user of search progress
    await reply('```🔍 Searching for the song... 🎵```');
    
    let videoUrl = q;
    let videoDetails;
    
    // If the input is not a URL, search YouTube for the video
    if (!q.includes('youtube.com/watch') && !q.includes('youtu.be/')) {
      const searchResults = await yts(q);
      
      // Check if search results are valid
      if (!searchResults?.videos?.length) {
        return await reply('*❌ No results found! Try different keywords.*');
      }
      
      videoDetails = searchResults.videos[0]; // Use the first search result
      videoUrl = videoDetails.url;
    } else {
      // If the input is a URL, fetch video details using yt-search
      const videoId = extractVideoId(videoUrl);
      
      if (!videoId) {
        return await reply('*❌ Invalid YouTube URL. Please provide a valid URL or keywords.*');
      }
      
      try {
        const searchResults = await yts({ videoId });
        
        // Check if video details are valid
        if (!searchResults?.videos?.length) {
          return await reply('*❌ Failed to fetch video details. Please try again later.*');
        }
        
        videoDetails = searchResults.videos[0];
      } catch (error) {
        console.error('Error fetching video details:', error.message);
        return await reply('*❌ Failed to fetch video details. Please try again later.*');
      }
    }
    
    // Extract video details
    const { title, thumbnail, duration, views, author } = videoDetails;
    const caption = `*🎶 Song Name* - ${title}\n🕜 *Duration* - ${duration}\n📻 *Listerners* - ${views}\n *🎙️ Artist* - ${author}\n> 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Тv10.1\n> File Name ${title}.mp3`;
    
    // Send thumbnail with caption
    await _action.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: _message });
    
    const videoId = extractVideoId(videoUrl);
    
    // Fetch audio download link using RapidAPI
    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '7c7eba5fb4msh5e7cf6b63765c19p1af119jsnc21557099ba8',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      },
      timeout: 50000 // Add timeout to prevent hanging requests
    };
    
    try {
      const response = await axios.request(options);
      
      if (response.data.status !== 'ok' || !response.data.link) {
        return await reply('*❌ Failed to fetch the audio. Please try again later.*');
      }
      
      // Notify user of download progress
      await reply('```⬇️ Downloading the song... 🎶```');
      
      // Download the MP3 file
      try {
        const mp3Response = await axios({
          method: 'GET',
          url: response.data.link,
          responseType: 'stream',
          timeout: 50000 // Add timeout for download
        });
        
        // Send the audio file to the user
        await _action.sendMessage(from, {
          audio: mp3Response.data,
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`
        }, { quoted: _message });
        
      } catch (downloadError) {
        console.error('Download error:', downloadError.message);
        return await reply('*❌ Failed to download the audio file. Please try again later.*');
      }
    } catch (apiError) {
      console.error('API error:', apiError.message);
      return await reply('*❌ Failed to connect to the audio service. Please try again later.*');
    }
  } catch (error) {
    console.error('Error:', error.message);
    await reply('*❌ An unexpected error occurred. Please try again later.*');
  }
});
