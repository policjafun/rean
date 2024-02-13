const { EmbedBuilder } = require('discord.js')
const axios = require("axios")

module.exports = {
    name: 'spotify',
    aliases: ['sp'],
    description: 'Current track played by user',
    category: 'info',
    usage: ['spotify [user]'],
    userPerms: [],
    clientPerms: [],
    run: async (client, message, args) => {
        try {
            let member = message.mentions.members.first() || findUser(message, args[0])
            let activity = member.presence.activities.find(act => act.type == 2)

            if(!activity){
                return args.error('This user don\'t listen anything.');
            }

            let embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setAuthor({ name: `${activity.state}` })
            .setDescription(`${activity.details}`)
            .setThumbnail(`https://i.scdn.co/image/${activity.assets.largeImage.replace("spotify:", "")}`)

            console.log(activity)


            message.reply({
                embeds: [embed]
            })

        } catch (e) {
            console.error(e);
           args.error('An error occurred while executing the command.');
        }
    }
}