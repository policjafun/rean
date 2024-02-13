const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'unlock',
    aliases: ['unlockdown', 'ulc', 'ulcd', 'unlock'],
    description: 'Unlock a channel',
    category: 'mod',
    usage: ['unlock [channel]'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            const channel = message.mentions.channels.first() || message.channel
            const roles = message.guild.roles.cache

            if(!channel.permissionsFor(message.guild.me).has(PermissionFlagsBits.ManageChannels)) return args.error('I need the Manage Channels permission to unlock a channel')

            roles.forEach(role => {
                try {
                    channel.edit({
                        permissionOverwrites: [
                            {
                                id: role.id,
                                allow: PermissionFlagsBits.SendMessages
                            }
                        ]
                    })
                } catch (e) {
                    args.error('I had trouble managing permissions for role ' + role.name)                    
                }
            })
            args.success(`Unlocked ${channel}`)
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'unlock', e)
        }
    }
}