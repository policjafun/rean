const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const client = require("../index.js");
const mongoose = require("mongoose");
const logs_model = require("../models/logsModel");

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId.startsWith('logs_setup')) {
        if (interaction.customId.startsWith('logs_setup_add')) {
            if (interaction.user.id !== interaction.customId.replace('logs_setup_add:', '')) return interaction.reply({ content: 'This is not your interaction', ephemeral: true });
            const values = interaction.values;

            const data = await logs_model.findOne({ guildId: interaction.guild.id });
            if(data) {
                for (let i = 0; i < values.length; i++) {
                    if (!data.enabledEvents.includes(values[i])) {
                        data.enabledEvents.push(values[i]);
                    }
                }
                await data.save();
                interaction.reply({ content: 'Successfully added the events', ephemeral: true });
            } else if(!data) {
                const newData = new logs_model({
                    guildId: interaction.guild.id,
                    channelId: null,
                    enabledEvents: values,
                    turn: false
                });
               await newData.save();
                interaction.reply({ content: 'Successfully added the events', ephemeral: true });
            }
        } else if (interaction.customId.startsWith('logs_setup_remove')) {
            if (interaction.user.id !== interaction.customId.replace('logs_setup_remove:', '')) return interaction.reply({ content: 'This is not your interaction', ephemeral: true });
            const values = interaction.values;

            const data = await logs_model.findOne({ guildId: interaction.guild.id });
            if(data) {
                data.enabledEvents = data.enabledEvents.filter((event) => !values.includes(event));
                data.save();
                interaction.reply({ content: 'Successfully removed the events', ephemeral: true });
            } 
        }
    }
});
