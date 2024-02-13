const Discord = require('discord.js');
module.exports = {
    name: 'nuke',
    aliases: ['bomb'],
    description: 'Clear a whole channel',
    userPerms: ['ManageChannels'],
    botPerms: ['ManageChannels'],
    usage: ['nuke'],
    run: async (client, message, args) => {
        function nuke() {
            try {
                message.channel.clone().then((channel) => {
                    channel.setPosition(message.channel.position).then(() => {
                        try {
                            message.channel.delete();
                        } catch (e) {
                            args.error(
                                'Cannot delete this channel.'
                            );
                        }
                    });
    
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(
                            `Successfully nuked channel.`
                        );
    
                    channel.send({
                        embeds: [embed],
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000)
                    })
                });
            } catch (e) {
                args.error('An error occurred while executing the command')
            }
        }
        const embed = new Discord.EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(
                `Are you sure you want to nuke this channel?`
            )

        const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('nuke-yes')
                        .setStyle(3)
                        .setLabel('Yes'),
                    new Discord.ButtonBuilder()
                        .setCustomId('nuke-no')
                        .setStyle(4)
                        .setLabel('No')
                )
            
        const msg = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        const filter = (i) => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector(filter, { time: 10000, componentType: Discord.ComponentType.Button });
        
        collector.on('collect', async (i) => {
            if(i.user.id !== message.author.id) return i.reply({ content: 'You are not the author of this command', ephemeral: true });
            if (i.customId === 'nuke-yes') {
                nuke();
                collector.stop();
            } else if (i.customId === 'nuke-no') {
                msg.delete();
                collector.stop();
            }
        });
    },
};
