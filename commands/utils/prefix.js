const { EmbedBuilder } = require('discord.js')
const prefix_schema = require('../../models/prefix');
const clinet = require('../../index.js')

module.exports = {
    name: 'prefix',
    aliases: ['prefixes', 'setprefix'],
    description: 'Manage the prefixes of the bot',
    category: 'utils',
    usage: ['prefix [add | remove] [prefix]'],
    userPerms: ['Administrator'],
    clientPerms: ['Administrator'],
    run: async (client, message, args) => {
        try {
            const input = args.join(' ').replace(args[0], '')
            const input1 = input.trim();
            const action = args[0]

            if (input1 === '') {
                return args.error('Prefix cannot be empty');
            }

            const prefixes = await client.db.prefix.findOne({
                guildId: message.guild.id,
            });

            if (!action) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setFields([
                        {
                            name: 'Prefixes',
                            value: '```' + prefixes.prefixes.join('\n') + '```'
                        }
                    ])

                message.reply({ embeds: [embed] })
            } else if(action == 'add') { 
                if (prefixes.prefixes.includes(input1)) return args.error('This prefix is already added')

                await client.db.prefix.findOneAndUpdate({
                    guildId: message.guild.id
                }, {
                    $push: {
                        prefixes: input1
                    }
                })

                args.success(`Added the prefix \`${input1}\``)
            } else if(action == 'remove') {
                    if (!prefixes.prefixes.includes(input1)) return args.error('This prefix is not added')
    
                    await client.db.prefix.findOneAndUpdate({
                        guildId: message.guild.id
                    }, {
                        $pull: {
                            prefixes: input1
                        }
                    })
    
                    args.success(`Removed the prefix \`${input1}\``)
            } else {
                args.usage('prefix')
            }
        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'prefix', e)
        }
    }
}