const { EmbedBuilder } = require('discord.js')
const util = require('node:util');

module.exports = {
    name: 'banner',
    description: 'Shows banner of a user',
    usage: 'avatar [user]',
    category: 'info',
    run: async (client, message, args) => {
        try {
            let user;
            try {
                if (args[0]) {
                    user = message.mentions.users.first() || client.users.cache.find((u) =>  u.username.toLowerCase().includes(args[0].toLowerCase())) || (await client.users.fetch(args[0]));
                } else {
                    user = message.author;
                }
            } catch (err) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setDescription(
                        `I cant find that user!`
                    );

                return message.reply({
                    embeds: [embed],
                });
            }
            await user.fetch();
            
            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}'s banner`)

            if(user.banner !== null) {
                embed.setImage(user.bannerURL({ dynamic: true, size: 4096 }))
                embed.setDescription('[Banner URL](' + user.bannerURL({ dynamic: true, size: 4096 }) + ')')
            } else  {
                embed.setDescription('This user doesn\'t have a banner! His accent color: ' + `**#${user.accentColor.toString(16)}**`)
            }

            message.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'banner', e)
        }
    }
}