const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const client = require("../index.js");
const mongoose = require("mongoose");
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if(interaction.customId === "mongoprevious" || interaction.customId === "mongonext") {
        const modelName = interaction.message.embeds[0].title;
        const itemsPerPage = 1; 
        const page = args[4] || 1;

        if (interaction.customId === "mongoprevious") {
    
            if (page > 1) {
        
                page--;
            }
        } else if (interaction.customId === "mongonext") {
            // Obsłuż kliknięcie "Next"
            const Model = mongoose.models[modelName];
            const items = await Model.find();
            const totalPages = Math.ceil(items.length / itemsPerPage);

            if (page < totalPages) {
                page++;
            }
        }


        const pagedItems = getItemsForPage(page, itemsPerPage, items);

        const List_Embed = new EmbedBuilder()
            .setTitle("Model List")
            .setDescription("Model name: " + modelName)
            .addFields({
                name: "Items:",
                value: pagedItems.map((item) => item.toString()).join("\n"),
            })
            .setFooter(`Page ${page} of ${totalPages}`);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("previous")
                .setLabel("Previous")
                .setStyle(1)
                .setDisabled(page === 1),
            new ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle(1)
                .setDisabled(page === totalPages)
        );
        
        await interaction.update({ embeds: [List_Embed], components: [row] });
    }
    if(!interaction.customId === "next" || "previous") return;
    if (!interaction.isButton()) return;
    const modelName = interaction.message.embeds[0].title;
    const itemsPerPage = 1; 
    const page = args[4] || 1;

    if (interaction.customId === "previous") {
   
        if (page > 1) {
      
            page--;
        }
    } else if (interaction.customId === "next") {
        // Obsłuż kliknięcie "Next"
        const Model = mongoose.models[modelName];
        const items = await Model.find();
        const totalPages = Math.ceil(items.length / itemsPerPage);

        if (page < totalPages) {
            page++;
        }
    }


    const pagedItems = getItemsForPage(page, itemsPerPage, items);

    const List_Embed = new EmbedBuilder()
        .setTitle("Model List")
        .setDescription("Model name: " + modelName)
        .addFields({
            name: "Items:",
            value: pagedItems.map((item) => item.toString()).join("\n"),
        })
        .setFooter(`Page ${page} of ${totalPages}`);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle(1)
            .setDisabled(page === 1),
        new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(1)
            .setDisabled(page === totalPages)
    );
    
    await interaction.update({ embeds: [List_Embed], components: [row] });
});
