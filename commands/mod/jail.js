const { EmbedBuilder } = require('discord.js')
const Discord = require('discord.js');
let t = Discord;
const __jail = require('../../models/jail.js')

module.exports = {
    name: 'jail',
    aliases: ['j'],
    description: 'Jail a member',
    category: 'mod',
    usage: ['jail <@user>'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return args.error('Please provide a member to jail')

        const x = __jail.fineOne({ guildId: message.guild.id });

        message.guild.channels.cache.forEach(async (channel) => {
            const d = channel.permissionsFor(member).has(t.PermissionsBitField.Flags.ViewChannel)
            if (d) {
                channel.permissionOverwrites.set(member, {
                    
                })
            }
        })


    }
}