const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const client = require("../index.js");
const mongoose = require("mongoose");
const prefix_schema = require("../models/prefix");
const messages_schema = require("../models/messages")

client.on('messageCreate', async (message) => {
    if(message.author.bot || message.channel.isDMBased()) return;
    let inf = await client.db.prefix.findOne({
        guildId: message.guild.id,
    });
    let prf;
    for (let prefix of inf.prefixes) {
        if (prefix == undefined) continue;
        if (message.content.startsWith(prefix)) prf = prefix;
    }
    let args = message.content.split(` `);
    let cmd = args.shift().toLowerCase();
    let command =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
    if (prf + command) return;
    function isInArray(value, array) {
        return array.indexOf(value) > -1;
      }
    const messages = await message.channel.messages.fetch({ limit: 10 });
    const lastTenMessages = messages.map(m => m.content.toLowerCase());
    lastTenMessages.shift()
    if (isInArray(message.content.toLowerCase(), lastTenMessages)) return;
    const messages_data = await messages_schema.findOne({ userId: message.author.id })
    if(messages_data) {
        messages_data.messageCount++
        messages_data.save()
    } else if(!messages_data) {
        const newData = new messages_schema({ userId: message.author.id, messageCount: 1 })
        await newData.save();

    }
    });


