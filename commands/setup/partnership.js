const { EmbedBuilder } = require('discord.js')
const partnerstwaDb = require('../../models/PartnerstwaSchema')
module.exports = {
    name: 'partnership',
    aliases: ['partner'],
    description: 'Set the partnerships on guild',
    category: 'setup',
    usage: ['partnerships turn <on|off>', 
            'partnerships channel <#channel>'],
    userPerms: ['ManageGuild'],
    clientPerms: ['ManageGuild'],
    run: async (client, message, args) => {
        if (!args[0]) return args.usage('partnership');

        switch (args[0]) {
            case "turn": {

            } break;
            case "channel": {
                try {
                    const guildId = message.guild.id;
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                    if(!channel) return args.error('channel not found')
                    let existingEntry = await partnerstwaDb.findOne({ guildId: guildId });
                    if (existingEntry) {
                        existingEntry.ChannelId = channel.id;
                        await existingEntry.save();
                        const embed = new EmbedBuilder()
                            .setTitle("Successfully saved channel")
                            .setColor(client.config.color)

                        message.reply({ embeds: [embed] });
                    } else {
                        const newPartnerstwochannel = new partnerstwaDb({
                            guildId: guildId,
                            ChannelId: channel.id,
                        });

                        await newPartnerstwochannel.save();
                        const embed = new EmbedBuilder()
                            .setTitle("Successfully saved channel")
                            .setColor(client.config.color)
                        message.reply({ embeds: [embed] });
                    }

                } catch (e) {
                    console.log(e)
                }
            } break;
        }
    }
}