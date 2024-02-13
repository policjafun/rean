const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'ban',
    aliases: ['wypierdalaj'],
    description: 'Ban a user',
    category: 'mod',
    usage: ['ban <user> [reason]'],
    userPerms: ['BanMembers'],
    clientPerms: ['BanMembers'],
    run: async (client, message, args) => {
        try {
            if(!args[0]) return args.usage('ban');
            const member = message.mentions.members.first() || findUser(message, args[0])
            const reason = args.slice(1).join(' ') || '*No reason provided*';

            if (member.roles.highest.position >= message.member.roles.highest.position) return args.error(`You can't mute this user!`)

            if (!member) return args.usage('ban')
            if (!member.bannable) return message.reply(`I can't ban this user!`)
            if (member.id === message.author.id) return message.reply(`You can't ban yourself!`)
            if (member.id === client.user.id) return message.reply(`You can't ban me!`)

            await member.ban({ reason: reason })

            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle('Ban hammer has spoken')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setFields([
                    {
                        name: 'Username',
                        value: member.user.username,
                        inline: true
                    },
                    {
                        name: 'Reason',
                        value: reason,
                        inline: true
                    }

                ])
            message.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'ban', e)
        }
    }
}
