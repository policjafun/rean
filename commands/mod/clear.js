const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['purge'],
    description: 'Clear messages in a channel',
    category: 'mod',
    usage: ['clear <amount>'],
    userPerms: ['ManageMessages'],
    clientPerms: ['ManageMessages'],
    run: async (client, message, args) => {
        try {
            const amount = parseInt(args[0])
            const startTime = Date.now(); // start time of the bulk delete operation

            if(amount < 100) {
                let deleted = 0;
                await message.channel.bulkDelete(amount).then(messages => {
                    deleted = messages.size
                })
                setTimeout(() => {
                    message.channel.send(`Deleted ${deleted} messages in ${Date.now() - startTime}ms`)
                }, 300)
            } else if(amount > 100) {
                let deleted = 0;
                let loops = Math.floor(amount / 100)

            

                let rest = amount % 100
                for(let i = 0; i < loops; i++) {
                    await message.channel.bulkDelete(100).then(messages => {
                        deleted += messages.size
                    })
                }
                setTimeout(() => {
                    const timeTaken = (Date.now() - startTime) / 1000;
                    message.channel.send(`Deleted ${deleted} messages in ${timeTaken} seconds`);
                }, 300);

            }
        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'clear', e)
        }
    }
}