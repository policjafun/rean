const { ComponentType } = require(`discord.js`)
const { inspect } = require(`util`)
const Discord = require('discord.js')

function chunkRight (str, size = 1500) {
    if (typeof str === 'string') {
        const length = str.length
        const chunks = Array(Math.ceil(length / size))
        if (length) {
            chunks[0] = str.slice(0, length % size || size)
            for (let i = 1, index = chunks[0].length; index < length; i++) {
                chunks[i] = str.slice(index, index += size)
            }
        }
        return chunks
    }
}

module.exports = {
    name: `eval`,
    aliases: [`e`],
    description: `Run code`,
    usage: [`eval <code>`],
    developerOnly: true,
    run: async (client, message ,args) => {
        let code = args.join(` `)
        if(!args || args.length < 1 || args == ""){
            return args.usage("eval")
        }

        let messag = await message.reply(`Wait a second...`)
        try {
            let evaled = await eval(code)
            evaled = inspect(evaled, {showHidden: false})
            if (evaled.includes(client.token))
                return messag.edit({
                    content: `You tried to be sneaky and get my token, but I'm smarter than you.`
                })
            let msgs = chunkRight(evaled)
            await messag.delete()
            let allPages = msgs.length
            let crtPage = 0
            let row = new Discord.ActionRowBuilder().setComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`page-back`)
                    .setStyle(2)
                    .setEmoji('⬅️')
                    .setDisabled(true),
                new Discord.ButtonBuilder()
                    .setCustomId(`page-close`)
                    .setEmoji('❌')
                    .setStyle(4),
                new Discord.ButtonBuilder()
                    .setCustomId(`page-next`)
                    .setStyle(2)
                    .setEmoji('➡️')
                    .setDisabled(true)
            );

            if (allPages === 1)
                row.components[2].data.disabled = true

            let mesg = await message.channel.send({
                content: `\`\`\`ts\n${msgs[crtPage]}\`\`\``,
                components: [row]
            })

            const collector = message.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000 * 5
            })

            collector.on(`collect`, (i) => {
                if (message.author.id !== i.user.id)
                    return i.reply({
                        content: `That's not your interaction!`,
                        ephemeral: true
                    })

                if (i.message.id != mesg.id)
                    return

                if (i.customId === `page-back`) {
                    crtPage -= 1

                    if (crtPage === 0)
                        row.components[0].data.disabled = true

                    if (crtPage + 1 !== allPages)
                        row.components[2].data.disabled = false

                    row.components[1].data.label = `${crtPage + 1}/${allPages}`

                    mesg.edit({
                        content: `\`\`\`ts\n${msgs[crtPage]}\`\`\``,
                        components: [row]
                    })

                    i.deferUpdate()

                }

                if (i.customId == `page-close`) {
                    i.message.delete()
                    i.deferUpdate()
                }

                if (i.customId == `page-next`) {
                    crtPage += 1

                    if (crtPage === 0)
                        row.components[0].data.disabled = true

                    if (crtPage !== 0)
                        row.components[0].data.disabled = false

                    if (crtPage + 1 !== allPages)
                        row.components[2].data.disabled = false

                    if (crtPage + 1 === allPages)
                        row.components[2].data.disabled = true

                    row.components[1].data.label = `${crtPage + 1}/${allPages}`

                    mesg.edit({
                        content: `\`\`\`ts\n${msgs[crtPage]}\`\`\``,
                        components: [row]
                    })

                    i.deferUpdate()
                }
            })
        } catch (err) {
            message.reply({
                content: `\`\`\`js\n${err}\`\`\``
            })
        }
    }
}