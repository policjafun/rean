const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'unban',
    aliases: ['ub', 'pardon', 'uban'],
    description: 'Unban a user',
    category: 'mod',
    usage: ['unban <user>'],
    userPerms: ['BanMembers'],
    clientPerms: ['BanMembers'],
    run: async (client, message, args) => {
        try {
            const user = args[0]

            if (!user) return args.error('I can\'t find that user.')
            if (!user.banned) return args.error('This user is not banned.')

            await message.guild.members.unban(user)
            args.success('Successfully unbanned this user')
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'unban', e)
        }
    }
}