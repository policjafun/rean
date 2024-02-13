const { EmbedBuilder } = require('discord.js')
const prefix_schema = require('../../models/prefix')
const badges_schema = require('../../models/badges')

module.exports = {
    name: 'config',
    aliases: ['cfg'],
    description: 'Bot config',
    category: 'dev',
    developerOnly: true,
    usage: ['cfg <variable> <value> <value> <value>'],
    userPerms: ['Administrator'],
    clientPerms: ['Administrator'],
    run: async (client, message, args) => {
        try {
            const value = args[1]
            if(args[0] == 'deletetickets') {
                message.guild.channels.cache.forEach(channel => {
                    if(channel.name.startsWith('ticket_')) {
                        channel.delete()
                    }
                })
            }

            if(args[0] == 'badge') {
                const badge = args[3]
                if(!badge) return args.error('No badge given.')
                if(!Object.keys(client.config.badges).includes(badge)) {
                    args.error(`Invalid badge: ${badge}`)
                    return
                }
                switch(value) {
                    case 'give': {
                        const user = message.mentions.users.first() || findUser(message, args[2])
                        const member = message.guild.members.cache.get(user.id);
                        if(!member) args.error('No member')
                        const badges = await badges_schema.findOne({ userID: user.id })
                        if(!badges) {
                            const newbadges = new badges_schema({
                                userID: user.id,
                                badges: [badge]
                            })
                            newbadges.save()
                            args.success(`Added ${badge} to ${user.username}`)
                        } else {
                            if(badges.badges.includes(badge)) {
                                args.error(`${user.username} already has ${badge}`)
                            } else {
                                badges.badges.push(badge)
                                badges.save()
                                args.success(`Added ${badge} to ${user.username}`)
                            }
                        }
                    } break;
                    case 'remove': {
                        const user = message.mentions.users.first() || findUser(message, args[2])
                        const member = message.guild.members.cache.get(user.id);
                        if(!member) args.error('No member')
                        const badges = await badges_schema.findOne({ userID: user.id })
                        if(!badges) {
                            args.error(`${user.username} doesn't have ${badge}`)
                        } else {
                            if(badges.badges.includes(badge)) {
                                badges.badges.splice(badges.badges.indexOf(badge), 1)
                                badges.save()
                                args.success(`Removed ${badge} from ${user.username}`)
                            } else {
                                args.error(`${user.username} doesn't have ${badge}`)
                            }
                        }
                    } break;
                }
            }


        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
        }
    }
}