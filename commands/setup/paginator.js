const { EmbedBuilder } = require('discord.js')
const __paginator = require('../../models/paginator.js')
module.exports = {
    name: 'paginator',
    aliases: ['spage', 'spa'],
    description: 'Change some settings for paginator',
    category: 'setup',
    usage: ['paginator <options> [emoji | default]'],
    run: async (client, message, args) => {
        if (!args[0]) return args.usage('paginator');
        switch (args[0]) {
            case "emoji": {
                if (!args[1]) return args.usage('paginator');
                if (args[1] === "default") {
                    const existingPaginator = await __paginator.findOne({ userId: message.author.id });
                    if (existingPaginator) {
                        await existingPaginator.deleteOne();
                        return args.success('Emoji has been removed successfully.');
                    } else {
                        return args.error('You do not currently have any emoji set.');
                    }
                }
                const emojiMatch = args[1].match(/<a?:\w+:(\d+)>/);
                if (!emojiMatch) {
                    return args.error('Invalid emoji format. Please use a valid custom emoji.');
                }
                const emoji = emojiMatch[1];
                console.log(emoji)
                const guildEmoji = client.emojis.cache.find(guildEmoji => guildEmoji.id === emoji);
                console.log(guildEmoji)
                if (!guildEmoji) {
                    return args.error('This emoji does not exist in my cache, please try again with an emoji that is in the guild with rean.');
                }

                const existingPaginator = await __paginator.findOne({ userId: message.author.id });
                if (existingPaginator) {
                    existingPaginator.emoji = emoji;
                    await existingPaginator.save();
                    return args.success('Emoji has been updated successfully.');
                } else {
                    const newPaginator = new __paginator({
                        userId: message.author.id,
                        emoji: emoji
                    });
                    await newPaginator.save();
                    return args.success('New emoji has been set successfully.');
                }
            } break
        
        }
    }
}