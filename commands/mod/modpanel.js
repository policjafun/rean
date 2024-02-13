const Discord = require('discord.js')

module.exports = {
    name: 'modpanel',
    aliases: ['mp'],
    description: 'Display the mod panel',
    category: 'mod',
    usage: ['mp <@user>'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || findUser(message, args[0])
        if (member.roles.highest.position >= message.member.roles.highest.position) return args.error(`You can't do anything with that user!`)
        if(!member) return args.error('Not found this guild member ¯\_(ツ)_/¯')

        const panel = new Discord.EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({name: `${member.user.tag}〡${member.id}` , iconURL: member.user.displayAvatarURL()})
        .setDescription(`What to do?`)
        .setTimestamp()
        const pannelcomps = new Discord.ActionRowBuilder()
        .addComponents(new Discord.StringSelectMenuBuilder().setMaxValues(1).setPlaceholder("select an action").addOptions({label: "timeout", value: "modpanel_t/o", description: "timeout member"}, {label: "kick", value: "modpanel_kick", description: "kick member"}, {label: "ban", value: "modpanel_ban", description: "ban member"}, {label: "jail", value: "modpanel_jail", description: "jail member"}).setCustomId("modpanel"))
    
        message.reply({ embeds: [panel], components: [pannelcomps] })
    }
}