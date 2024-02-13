const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'embed',
    aliases: ['sayembed'],
    description: 'Send an embed message',
    category: 'mod',
    usage: ['embed <codeInJson>'],
    userPerms: ['Administrator'],
    clientPerms: ['Administrator'],
    run: async (client, message, args) => {
        const json = args.join(' ')
        const embedData = JSON.parse(json)
        if (!embedData.color) {
            embedData.color = parseInt(client.config.color.replace('#', ''), 16)
        }
        if (embedData.image) {
            embedData.image = { url: embedData.image }
        }
        const embed = new EmbedBuilder(embedData)
        message.channel.send({ embeds: [embed] })
    }
}
