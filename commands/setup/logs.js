const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const logs_model = require('../../models/logsModel')

module.exports = {
    name: 'logs',
    aliases: ['logs'],
    description: 'Logs system',
    category: 'setup',
    usage: ['logs channel <channel>',
            'logs <enable/disable>',
            'logs setup <add/remove>'],
    userPerms: ['ModerateMembers'],
    developerOnly: true,
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            if(!args[0]) return args.usage('logs')
            const events = [
                'messageDelete',
                'bulkMessageDelete',
                'messageEdit',
                'channelCreate',
                'channelDelete',
                'channelEdit',
                'roleCreate',
                'roleUpdate',
                'roleDelete',
                'memberUnban',
                'memberBan',
                'guildUpdate',
                'threadCreate',
                'threadUpdate',
                'threadRemove',
                'threadDelete',
                'inviteCreate',
                'inviteDelete'
            ]
            const descriptions = [
                'Message Deleted',
                'Bulk Message Deleted',
                'Message Edited',
                'Channel Created',
                'Channel Deleted',
                'Channel Edited',
                'Role Created',
                'Role Updated',
                'Role Deleted',
                'Member Unbanned',
                'Member Banned',
                'Guild Updated',
                'Thread Created',
                'Thread Updated',
                'Thread Removed',
                'Thread Deleted',
                'Invite Created',
                'Invite Deleted'
            ]
            const type = args[0].toLowerCase()
            switch(type) {
                case 'channel': {
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                    if(!channel) return args.error('Please provide a channel')
                    const data = await logs_model.findOne({ guildId: message.guild.id })

                    if(data) {
                        data.channelId = channel.id
                        data.save()
                        args.success('Successfully set the logs channel to ' + `${channel}`)
                    } else if(!data) {
                        const newData = new logs_model({
                            guildId: message.guild.id,
                            channelId: channel.id,
                            enabledEvents: []
                        })
                        newData.save()
                        args.success('Successfully set the logs channel to ' + `${channel}`)
                    }
                } break;
                case 'enable': {
                    const data = await logs_model.findOne({ guildId: message.guild.id})
                    if(!data.channelId) return args.error('Please set the channel firts')
                    if(data) {
                        data.turn = true
                        data.save()
                        args.success('Successfully enabled the logs system')
                    }
                } break;
                case 'disable': {
                    const data = await logs_model.findOne({ guildId: message.guild.id})

                    if(data) {
                        data.turn = false
                        data.save()
                        args.success('Successfully disabled the logs system')
                    } else if(!data) {
                        const newData = new logs_model({
                            guildId: message.guild.id,
                            channelId: null,
                            enabledEvents: [],
                            turn: false
                        })
                        newData.save()
                        args.success('Successfully disabled the logs system')
                    }
                } break;
                case 'setup': {
                    const embed = new EmbedBuilder()
                        .setTitle('Logs Setup')
                        .setColor(client.config.color)
                        .setDescription('Please select the events you want to add/remove')
                    data = await logs_model.findOne({ guildId: message.guild.id })
                    if (args[1] === 'add') {
                        const eventsToAdd = []
                        const enabledEvents = data.enabledEvents

                        for (let i = 0; i < events.length; i++) {
                            if (!enabledEvents.includes(events[i])) {
                                eventsToAdd.push(events[i])
                            }
                        }
                        if(eventsToAdd.length == 0) return args.error("You've already added all the events");

                        const menu_add = new StringSelectMenuBuilder()
                            .setCustomId(`logs_setup_add:${message.author.id}`)
                            .setPlaceholder('Select an event')
                            .setMinValues(1)
                            .setMaxValues(eventsToAdd.length)

                        for (let i = 0; i < eventsToAdd.length; i++) {
                            menu_add.addOptions({
                                label: eventsToAdd[i],
                                value: eventsToAdd[i],
                                description: descriptions[events.indexOf(eventsToAdd[i])],
                            })
                        }

                        message.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(menu_add)] })

                    } else if (args[1] == 'remove') {
                        if(data?.enabledEvents?.length !== 0) {
                            const events1 = data.enabledEvents;

                            const menu_remove = new StringSelectMenuBuilder()
                                .setCustomId(`logs_setup_remove:${message.author.id}`)
                                .setPlaceholder('Select an event')
                                .setMinValues(1)
                                .setMaxValues(events1.length);

                            for (let i = 0; i < events1.length; i++) {
                                menu_remove.addOptions({
                                    label: events1[i],
                                    value: events1[i],
                                    description: descriptions[events.indexOf(events1[i])],
                                });
                            }

                            message.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(menu_remove)] })
                        } else {
                            return args.error('There are no events to remove')
                        }
                    }
                } break;
            }
        } catch(e) {
            console.log(e)
            args.error('An error occured while running this command')
        }
    }
}