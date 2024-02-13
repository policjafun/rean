const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'tiktok',
    description: 'Get the video from TikTok via link',
    aliases: ['tt'],
    run: async (client, message, args) => {
        const tikTokUrl = args[0];
        const tikTokApiUrl = 'https://tiktok-download-video1.p.rapidapi.com/getVideo';
        const rapidApiKey = '1e2e6a1647msha4af2f61081c45fp18d730jsna4254458f0fd';
        
        if (!tikTokUrl) {
          return message.reply('Please provide a TikTok video URL!');
        }
        try {
            const response = await axios.get(tikTokApiUrl, {
              params: {
                url: tikTokUrl,
                hd: '1',
              },
              headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'tiktok-download-video1.p.rapidapi.com',
              },
            });
      
            const videoUrl = response.data.data.play;
      
            const embed = new Discord.EmbedBuilder()
              .setTitle(response.data.data.title || null)
              .setDescription(`By **${response.data.data.author.nickname}**` || "no desc :/")
              .setColor(client.config.color)
              .setTimestamp()
              .setURL(tikTokUrl)
              
      
            message.channel.send({embeds:[embed]});
            message.channel.send({content: `||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ${videoUrl}`});
          } catch (error) {
            console.error(error);
            message.reply('Error fetching TikTok video.');
          }
    },
};
