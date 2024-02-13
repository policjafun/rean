const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'botinfo',
    cooldown: 3000,
    aliases: ['bot', 'info'],
    description: 'Get info about the bot!',
    category: 'info',
    usage: ['botinfo'],
    run: async (client, message, args) => {
        try {
            let totalSeconds = client.uptime / 1000;
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            let users = 0;
            client.guilds.cache.forEach(guild => {
                users += guild.memberCount
            })

            const commands = client.commands.size

            const uptime = `${days} d ${hours} h ${minutes} m ${seconds} s`
            
            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription('> Do you need help? **[Support](https://discord.gg/GTssV4auGH)**.\n> If you want to get *rean* on your server ask for whitelist at this server.')
                .setFields([
                    {
                        name: 'Statistics',
                        value: `Users: ${users} (${client.users.cache.size} cached)\nGuilds: ${client.guilds.cache.size}\nCommands: ${commands}`,
                        inline: true
                    },
                    {
                        name: 'Bot',
                        value: `Ping: ${client.ws.ping}ms\nUptime: ${uptime}`,
                        inline: true
                    }
                ])

            message.reply({ embeds: [embed]})
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'botinfo', e)
        }
    }
}