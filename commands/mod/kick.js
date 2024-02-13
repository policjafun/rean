const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'kick',
    aliases: ['byebye'],
    description: 'Kick a user',
    category: 'mod',
    usage: ['kick <user> [reason]'],
    userPerms: ['KickMembers'],
    clientPerms: ['KickMembers'],
    run: async (client, message, args) => {
        try {
            if(!args[0]) return args.usage('kick');
            const member = message.mentions.members.first() || findUser(message, args[0])
            const reason = args.slice(1).join(' ') || '*No reason provided*';

            if (member.roles.highest.position >= message.member.roles.highest.position) return args.error(`You can't kick this user!`)
            if (!member) return args.error('I can\'t find that user.')
            if (!member.kickable) return args.error('This user is not kickable.')

            await member.kick(reason)
            args.success('Kicked this user')
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'kick', e)
        }
    }
}