const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: 'guildinfo',
    aliases: ['si', 'gi', 'ginfo', 'sinfo', 'guildinfo', 'serverinfo'],
    description: 'Get info about the user!',
    category: 'info',
    usage: ['guildinfo'],
    cooldown: 3,
    run: async (client, message, args) => {
        try {
            const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const members = message.guild.members.cache;
            const channels = message.guild.channels.cache;

            const createdTimestamp = message.guild.createdTimestamp;
            const formattedCreatedTime = `<t:${Math.floor(createdTimestamp / 1000)}:R>`;

            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .addFields({ name: "General", value: `**Name:** ${message.guild.name}\n**ID:** ${message.guild.id}\n**Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}\n**Time Created:** ${formattedCreatedTime}`},
                {name: "Stats", value: `**Roles**: ${roles.length}\n**Member Count:** ${message.guild.memberCount}\n**Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`})
            


            message.reply({ embeds: [embed] })

        } catch (err) {
            console.log(err)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'guildinfo', err)
        }
    }
}