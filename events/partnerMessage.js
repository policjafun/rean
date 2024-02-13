const partnerShipsCount = require('../models/partnerShipsCount');
const partnerstwaDb = require('../models/PartnerstwaSchema');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Client, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const client = require("../index.js");


client.on("messageCreate", async (message) => {
    const guildId = message.guildId;
    const UserId = message.author.id
    try {
        const partnerstwaSchema = await partnerstwaDb.findOne({ guildId: guildId });



        if (partnerstwaSchema && partnerstwaSchema.ChannelId === message.channelId) {

            const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
            let wzmianki = message.mentions.members.first()
            const matched = message.content.match(regex)
            if (matched) {
            
                client.fetchInvite(`${matched}`).then(async (invite) => {
                    const name = invite.guild.name
                    const oznaczonyuser = client.users.cache.get(wzmianki)
       
                    const embed = new EmbedBuilder()
                        .setTitle("Nowe partnerstwo!")
                        .setDescription(`>>> <:wind_mapa:1138837111215243425>  ${message.author.username} [(realizator)](https://discord.com/users/${message.author.id}) \n <:wind_mapa:1138837111215243425> Z ${wzmianki || "Brak oznaczonego partnera"} [(partner)](https://discord.com/users/) `)
                        .addFields({ name: `>>> <:wind_info:1138831557960941578>  Invite Info`, value: `>>> <:wind_mapa:1138837111215243425> ${invite.guild.name}\n <:wind_osoby:1138831556513906758> ${invite.guild.memberCount}` })
                        .setFooter({ text: 'Beta by @doniczka' })
                        .setColor(client.config.color);
                    let partnerstwalicznikSchema = await partnerShipsCount.findOne({ UserId: UserId, guildId: guildId });

                    if (!partnerstwalicznikSchema) {
                        partnerstwalicznikSchema = await partnerShipsCount.create({ UserId: UserId, Amount: 1, guildId: guildId });
                    } else {
                        partnerstwalicznikSchema.Amount++;
                        partnerstwalicznikSchema.save();
                    }
                    message.channel.send({ embeds: [embed] })
        
                }).catch(console.error);


            } else {
            }
        }
    } catch (error) {
        console.error(error);
    }
});