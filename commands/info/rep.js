const { EmbedBuilder } = require('discord.js')
const reputation_schema = require('../../models/reputation')

module.exports = {
    name: 'reputation',
    aliases: ['rep'],
    description: 'Give a reputation to a user',
    category: 'info',
    usage: ['reputation <user>'],
    userPerms: [''],
    clientPerms: [''],
    run: async (client, message, args) => {
        try {
            if(!args[0]) return args.usage('reputation')
            const user = message.mentions.users.first() || findUser(message, args[0])
            if(!user) return args.error('User not found.')
            if(user.id === message.author.id) return args.error('You cannot give yourself a reputation.')
            if(user.user.bot == true) return args.error('You cannot give a bot a reputation.');


            const data = await reputation_schema.findOne({ userId: user.id })
            const userData = await reputation_schema.findOne({ userId: message.author.id })

            if(!userData) {
                const newData = new reputation_schema({
                    userId: message.author.id,
                    reputation_count: 0,
                    lastGiven: new Date()
                })
                await newData.save()
            }

            if(data && userData) {
                const lastGiven = userData.lastGiven
                const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000)
                if(lastGiven > eightHoursAgo) {
                    const nextAvailableTime = Math.floor((lastGiven.getTime() + 8 * 60 * 60 * 1000) / 1000)
                    return args.error(`You can only give a reputation point once every 8 hours. Next available time: <t:${nextAvailableTime}:R>`)
                }
                userData.lastGiven = new Date()
                await userData.save()
                data.reputation_count++
                await data.save()
                args.success(`You have given a reputation point to ${user}! Now they have ${data.reputation_count} reputation points!`)
            } else if(!data && userData) {
                const lastGiven = userData.lastGiven
                const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000)
                if(lastGiven > eightHoursAgo) {
                    const nextAvailableTime = Math.floor((lastGiven.getTime() + 8 * 60 * 60 * 1000) / 1000)
                    return args.error(`You can only give a reputation point once every 8 hours. Next available time: <t:${nextAvailableTime}:R>`)
                }
                const newData = new reputation_schema({
                    userId: user.id,
                    reputation_count: 1,
                    lastGiven: new Date()

                })
                await newData.save()
                userData.lastGiven = new Date()
                await userData.save()
                args.success(`You have given a reputation point to ${user}! Now they have ${newData.reputation_count} reputation points!`)

            } else if(data && !userData) {
                data.reputation_count++
                data.lastGiven = new Date()
                await data.save()
                args.success(`You have given a reputation point to ${user}! Now they have ${data.reputation_count} reputation points!`)
                
            }
        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'rep', e)
        }
    }
}