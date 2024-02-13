const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "invite",
    aliases: ["inv"],
    description: "Invite the bot to your server",
    category: "info",
    usage: ["invite"],
    cooldown: 3,
    run: async (client, message, args) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`If you want to have neet on your server join our [support](https://discord.gg/GTssV4auGH) server and make a ticket with whitelist request.`)

            message.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'invite', e)
        }
    }
}