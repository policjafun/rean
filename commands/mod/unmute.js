const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'unmute',
    aliases: ['untimeout', 'openmouth'],
    description: 'Remove timeout from a user',
    category: 'mod',
    usage: ['unmute <user> [reason]'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            const user = message.mentions.members.first() || findUser(message, args[0])

            if (!user) return args.usage('unmute')
            if (!user.isCommunicationDisabled()) return args.error('This user is not timeouted.')

            await user.timeout(null)
            args.success('Successfully removed timeout from this user')
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'unmute', e)
        }
    }
}