const { EmbedBuilder } = require('discord.js');
const WhitelistModel = require('../../models/whitelist');
const WhitelistStatus = require('../../models/whitelist_status')
module.exports = {
    name: 'whitelist',
    aliases: ['wl-add', 'wl'],
    description: 'Add whitelist to the guildId',
    developerOnly: true,
    usage: ['wl <add | rm | on | off | list | info> [guildId]'],
    category: 'dev',
    run: async (client, message, args) => {
        try {
            const guildId = args[1];
            const whitelisted = await WhitelistModel.findOne({ guildId: guildId });
            const whiteliststatus = await WhitelistStatus.findOne({ Enabled: true });
            if(!whiteliststatus) { await WhitelistStatus.create({ Enabled: true }); }

            const embed = new EmbedBuilder()
                .setColor(client.config.color)

            

            if (!args[0]) return args.usage('wl');
            if (!args[1] && args[0] !== 'on' && args[0] !== 'off' && args[0] !== 'list') return args.usage('wl');
            
            
                switch (args[0]) {
                    case 'info': {
                        if (whitelisted) {
                            const guild_data = whitelisted.guildId;
                            const guild = client.guilds.cache.get(guild_data);
                
                            if (guild) {
                                const members = guild.members.cache;
                
                                const onlineMembers = members.filter(member => member.presence && member.presence.status === 'online').size;
                                const idleMembers = members.filter(member => member.presence && member.presence.status === 'idle').size;
                                const dndMembers = members.filter(member => member.presence && member.presence.status === 'dnd').size;
                                const totalMembers = members.size;
                                const offlineMembers = totalMembers - (onlineMembers + idleMembers + dndMembers);              
                                const onlineEmoji = '<:online:1165601358632722543>';
                                const offlineEmoji = '<:offline:1165601360746659891>';
                                const idleEmoji = '<:idle:1165601363007393853>';
                                const dndEmoji = '<:dnd:1165601356044849234>';
                                const guild_owner = client.users.cache.get(guild.ownerId);
                                const guild_owner_profile = `https://discord.com/users/${guild_owner.id}`
                                const embed_with_data = new EmbedBuilder()
                                    .setColor(client.config.color)
                                    .setThumbnail(guild.iconURL({ dynamic: true }))
                                    .setFields([
                                        { name: "info", value: `(name) ${guild.name}\n(id) ${guild.id}\n (members) ${guild.memberCount}\n ([owner](${guild_owner_profile})) ${guild.ownerId} ${guild_owner.username}`, inline: true },
                                        { name: "stats", value: 
                                            `${onlineEmoji}: ${onlineMembers}\n` +
                                            `${offlineEmoji}: ${offlineMembers}\n` +
                                            `${idleEmoji}: ${idleMembers}\n` +
                                            `${dndEmoji}: ${dndMembers}`, inline: true
                                        }
                                    ]);
                                message.reply({ embeds: [embed_with_data] });
                            } else {
                                args.error("This guild is not found");
                            }
                        } else {
                            args.error("This guild is not whitelisted");
                        }

                    } break;
                    case "add": {
                        if(whitelisted) {
                            embed.setDescription(`This guild is already whitelisted!`)
                            return message.reply({ embeds: [embed] })
                        } else {
                            await WhitelistModel.create({
                                guildId: guildId,
                                isFlag: true,
                            });
                            embed.setDescription(`I've added this guild to the whitelist!`)
                            embed.setFields({ name: 'Guild ID', value: guildId, inline: true }, { name: 'Admin', value: `<@${message.author.id}>`, inline: true})
                            return message.reply({ embeds: [embed] })
                        }
                    } break;
                    case "rm": {
                        if(!whitelisted) {
                            embed.setDescription(`This guild is not whitelisted!`)
                            return message.reply({ embeds: [embed] })
                        } else {
                            await WhitelistModel.findOneAndDelete({ guildId: guildId });
                            embed.setDescription(`I've removed this guild from the whitelist!`)
                            embed.setFields({ name: 'Guild ID', value: guildId }, { name: 'Admin', value: `<@${message.author.id}>`})
                            return message.reply({ embeds: [embed] })
                        }
                    } break;
                    case "on": {
                        whiteliststatus.Enabled = true;
                        whiteliststatus.save();

                        embed.setDescription(`I've enabled the whitelist!`)
                        return message.reply({ embeds: [embed] })
                    } break;
                    case "off": {
                        whiteliststatus.Enabled = false;
                        whiteliststatus.save();

                        embed.setDescription(`I've disabled the whitelist!`)
                        return message.reply({ embeds: [embed] })
                    } break;
                    case "list": {
                        const whitelist = await WhitelistModel.find();
                        if (whitelist.length === 0) {
                            embed.setDescription('There are no whitelisted guilds.');
                        } else {
                            const guilds = whitelist.map((w, index) => {
                                const guild = client.guilds.cache.get(w.guildId);
                                return `${index + 1}. ID: ${w.guildId}, Name: ${guild ? guild.name : 'Unknown'}`;
                            }).join('\n');
                            embed.setDescription(guilds);
                        }
                        return message.reply({ embeds: [embed] });
                    } break;
                    
                    
                }
        

        } catch (e) {
            console.log(e)
            args.error('An error occurred while executing the command')
          
        }
    }
}
           