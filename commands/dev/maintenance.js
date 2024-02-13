const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'maintenance',
    aliases: ['mtain'],
    description: 'Maintenance mode',
    category: 'dev',
    developerOnly: true,
    usage: ['maintenance <on/off>'],
    userPerms: ['Administrator'],
    clientPerms: ['Administrator'],
    run: async (client, message, args) => {
        try {
            if(args[0] === 'on') {
                client.maintenance = true
                message.reply('Maintenance mode is now **on**')
            } else if(args[0] === 'off') {
                client.maintenance = false
                message.reply('Maintenance mode is now **off**')
            } else {
                message.reply('Please specify if you want to turn on or off maintenance mode')
            }
        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
        }
    }
}