const { EmbedBuilder } = require('discord.js')
const messages_model = require('../../models/messages')
module.exports = {
    name: 'messages',
    aliases: ['msgs', 'msg', 'm'],
    description: 'Show top 10 users with most messages',
    category: 'infp',
    usage: ['messages'],
    userPerms: [''],
    clientPerms: [''],
    run: async (client, message, args) => {
        try {
            const messages = await messages_model.find({ messageCount: { $gt: 0 } }).sort({ messageCount: -1 }).limit(10)
            const youHave = await messages_model.findOne({ userId: message.author.id})
                    
            const embed = new EmbedBuilder()
                .setTitle('Global messages leaderboard')
                .setColor(client.config.color)
                .setFooter({ text: `You have ${youHave.messageCount} messages`})
                    
                if(messages.length > 0) {
                    const descriptions = await Promise.all(messages.map(async (rep, index) => {
                        const msgUser = await client.users.fetch(rep.userId);
                        return `**${index + 1}.** ${msgUser.username} - ${rep.messageCount} msgs.`;
                    }));
                    embed.setDescription(descriptions.join('\n'));
                } else {
                    embed.setDescription('No users found!.');
                }
                        
            message.reply({ embeds: [embed] })
        } catch(e) {
            console.log(e)
        }
    }
}