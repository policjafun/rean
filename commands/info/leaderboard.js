const { EmbedBuilder } = require('discord.js')
const reputation_model = require('../../models/reputation')
const gamewins_model = require('../../models/gameWins')

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'top', 'lboard', 'leaderboards'],
    description: 'Shows the leaderboard of the guild',
    category: 'info',
    usage: ['leaderboard < reps | levels | money | gamewins > <global | local>'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            if (!message.guild.members.cache.has(message.author.id)) {
                return message.reply('You must be in the guild to use this command.')
            }
            if(!args[0]) return args.usage('leaderboard')
            switch(args[0]) {
                case 'gamewins':
                    const gamewins = await gamewins_model.find({ wins: { $gt: 0 } }).sort({ wins: -1 }).limit(10)

                    const embed = new EmbedBuilder()
                            .setTitle('Global game wins leaderboard')
                            .setColor(client.config.color)
                        
                    if(gamewins.length > 0) {
                        embed.setDescription(gamewins.map((gamewins, index) => {
                            const gameUser = client.users.cache.get(gamewins.userID)
                            return `**${index + 1}.** ${gameUser.globalName} - ${gamewins.wins} pts.`
                        }).join('\n'))
                    } else {
                        embed.setDescription('No users found')
                    }

                    message.reply({ embeds: [embed] })
                break;
                case 'reps':
                case 'reputation':
                case 'rep':
                    if(args[1] == 'global') {
                        const reps = await reputation_model.find({ reputation_count: { $gt: 0 } }).sort({ reputation_count: -1 }).limit(10)
                        
                        const embed = new EmbedBuilder()
                            .setTitle('Global reputation leaderboard')
                            .setColor(client.config.color)
                            .setFooter({ text: `You have ${await reputation_model.findOne({ userId: message.author.id }).reputation_count || '0'} reputation points.`})
                        
                        if(reps.length > 0) {
                            embed.setDescription(reps.map((rep, index) => {
                                const repUser = client.users.cache.get(rep.userId)
                                return `**${index + 1}.** ${repUser.globalName} - ${rep.reputation_count} pts.`
                            }).join('\n'))
                        } else {
                            embed.setDescription('No users found with reputation points.')
                        }
                        
                        message.reply({ embeds: [embed] })
                    } else if(args[1] == 'local') {
                        const reps = await reputation_model.find({ reputation_count: { $gt: 0 } }).sort({ reputation_count: -1 }).limit(10)

                        const localReps = reps.filter(rep => message.guild.members.cache.has(rep.userId))

                        const embed = new EmbedBuilder()
                            .setTitle('Local reputation leaderboard')
                            .setColor(client.config.color)
                            .setFooter({ text: `You have ${await reputation_model.findOne({ userId: message.author.id }).reputation_count || '0'} reputation points.`})

                        if(localReps.length > 0) {
                            embed.setDescription(localReps.map((rep, index) => {
                                const repUser = client.users.cache.get(rep.userId)
                                return `**${index + 1}.** ${repUser.globalName} - ${rep.reputation_count} pts.`
                            }).join('\n'))
                        } else {
                            embed.setDescription('No users found with reputation points.')
                        }

                        message.reply({ embeds: [embed] })
                        
                    } else if(!args[1]) {
                        const reps = await reputation_model.find({ reputation_count: { $gt: 0 } }).sort({ reputation_count: -1 }).limit(10)

                        const localReps = reps.filter(rep => message.guild.members.cache.has(rep.userId))

                        const embed = new EmbedBuilder()
                            .setTitle('Local reputation leaderboard')
                            .setColor(client.config.color)
                            .setFooter({ text: `You have ${await reputation_model.findOne({ userId: message.author.id }).reputation_count || '0'} reputation points.`})

                        if(localReps.length > 0) {
                            embed.setDescription(localReps.map((rep, index) => {
                                const repUser = client.users.cache.get(rep.userId)
                                return `**${index + 1}.** ${repUser.globalName} - ${rep.reputation_count} pts.`
                            }).join('\n'))
                        } else {
                            embed.setDescription('No users found with reputation points.')
                        }

                        message.reply({ embeds: [embed] })
                    }
            }
        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'leaderboard', e)
        }
    }
}