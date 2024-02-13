const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'stealemoji',
    aliases: ['se'],
    description: '',
    category: '',
    usage: [''],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        if (!args) return message.reply({ content: `No emojis provided!` });

        let desc = "Emoji(s) : ";

        for(let arg of args){
            if(arg.match(/[a][:]([A-Za-z0-9_~])+[:]\d{15,}/g || args.endsWith('.gif'))){
                let url = `https://cdn.discordapp.com/emojis/${arg.split(":")[2].replace(">", "")}.gif`
                let name = arg.replace("<a:", "").replace(":>", "").split(":")[0]

                if(arg.startsWith('http')){
                    url = arg
                    name = undefined
                }

                await message.guild.emojis.create({ attachment: url, name: name || 'rean' }).then(emoji => {
                    desc += `<a:${emoji.name}:${emoji.id}> `
                })
            } else {
                let url = `https://cdn.discordapp.com/emojis/${arg.split(":")[2].replace(">", "")}.webp`
                let name = arg.replace("<:", "").replace(":>", "").split(":")[0]

                if(arg.startsWith('http')){
                    url = arg
                    name = undefined
                }

                await message.guild.emojis.create({ attachment: url, name: name || 'rean' }).then(emoji => {
                    desc += `<:${emoji.name}:${emoji.id}> `
                })
            }
        }

        const embed = new EmbedBuilder()
            .setTitle("Successfully added emojis to server.")
            .setColor(client.config.color)
            .setDescription(desc);

        message.reply({ embeds: [embed] });
    }
}