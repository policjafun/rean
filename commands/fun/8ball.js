const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: '8ball',
    aliases: ['8b', 'eightball'],
    description: '8ball',
    category: 'fun',
    usage: ['8ball <question>'],
    run: async (client, message, args) => {
        try {
            const responses = [
                'It is certain.',
                'It is decidedly so.',
                'Without a doubt.',
                'Yes - definitely.',
                'You may rely on it.',
                'As I see it, yes.',
                'Most likely.',
                'Outlook good.',
                'Yes.',
                'Signs point to yes.',
                'Reply hazy, try again.',
                'Ask again later.',
                'Better not tell you now.',
                'Cannot predict now.',
                'Concentrate and ask again.',
                "Don't count on it.",
                'My reply is no.',
                'My sources say no.',
                'Outlook not so good.',
                'Very doubtful.',
                'It speaks for itself.',
                'I\'s so obvious. Yes!',
            ]

            const question = args.join(' ')
            if (!question) return args.error('Please provide a question.')

            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setFields([
                    { name: 'Question', value: question },
                    { name: 'Answer', value: responses[Math.floor(Math.random() * responses.length)] },
                ])

            message.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, '8ball', e)
        }
    }
}