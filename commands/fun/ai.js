const { EmbedBuilder, Collection } = require('discord.js')
const OpenAI = require("openai")
const model = require("../../models/ai-whitelist")

let messages = new Collection()

module.exports = {
    name: 'ai',
    description: 'FAST SUPER DUPER AI',
    category: 'fun',
    usage: ['ai <text>'],
    userPerms: [],
    clientPerms: [],
    run: async (client, message, args) => {

        let whitelist = await model.findOne({ userId: message.author.id })

        const aiclient = new OpenAI({
            apiKey: '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'
        })

        if(args[0].toLowerCase() == 'whitelist' && client.config.devs.includes(message.author.id)){
            let __whitelist = await model.findOne({ userId: args[1] })

            if(!__whitelist)
                await model.create({ userId: args[1] })
            else
                await model.deleteOne({ userId: args[1] })

            return message.reply({
                content: `Changed whitelist status for <@${args[1]}> from \`${!__whitelist ? "unwhitelisted" : "whitelisted"}\` to \`${!__whitelist ? "whitelisted" : "unwhitelisted"}\``
            })
        }

        if(!whitelist)
            return message.reply({
                content: 'You\'re not whitelisted'
            })

        if(args[0].toLowerCase() == 'stop'){
            messages.delete(message.author.id)

            return message.react('<a:yes:1172878740259360798>')
        }


        await message.channel.sendTyping()

        let __messages = messages.get(message.author.id) || []

        if (__messages == []){
            __messages.push({ role: 'system', content: 'You are super duper discord bot named rean, your basic functions is moderation, fun command and a lot of info. If user question who are you, answer with info with I provided for you ' })
        }

        __messages.push({ role: 'user', content: args.join(" ") })

        const chatCompletion = await aiclient.chat.completions.create({
            messages: __messages,
            model: 'gpt-3.5-turbo',
        });

        messages.set(message.author.id, __messages )

        message.reply({
            content: chatCompletion.choices[0].message.content
        })
    }
}