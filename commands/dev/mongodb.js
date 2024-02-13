const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    name: "mongodb",
    aliases: ["db"],
    description: "db",
    category: "dev",
    usage: ["db < list | change > <modelName> <parametr1> <parametr2>"],
    developerOnly: true,
    run: async (client, message, args) => {
        const modelName = args[1];
        const itemsPerPage = 1; 
        const page = args[4] || 1;
        switch (args[0]) {
            case "list":
                {
                    if (!mongoose.models[modelName]) {
                        args.error("Not found model");
                    }
                    const Model = mongoose.models[modelName];
                    try {
                        const items = await Model.find();
                        if (items.length === 0) {
                            args.error("Model have no items");
                            return;
                        }
                        const totalPages = Math.ceil(
                            items.length / itemsPerPage
                        );
                        if (page < 1 || page > totalPages) {
                            return args.error("Invalid page number.");
                        }
                        const start = (page - 1) * itemsPerPage;
                        const end = start + itemsPerPage;
                        const pagedItems = items.slice(start, end);

                        const row = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId("previous")
                                .setLabel("Previous")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === 1),
                            new ButtonBuilder()
                                .setCustomId("next")
                                .setLabel("Next")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === totalPages)
                        );
                        const List_Embed = new EmbedBuilder()
                        .setTitle(modelName)
                        .addFields({
                            name: "Items:",
                            value: pagedItems.map((item) => item.toString()).join("\n"),
                        })
                        .setColor(client.config.color);
                        message.reply({ embeds: [List_Embed], components: [row] });
                    } catch (e) {
                        console.error(e);
                    }
                }
                break;
            case "change":
                {
                    if (!mongoose.models[modelName]) {
                        message.channel.send(
                            "The specified model does not exist."
                        );
                        return;
                    }
                    const Model = mongoose.model(modelName);
                    const parametr1 = args[2];
                    const parametr2 = args[3];

                    try {
                        const znalezionyModel = await Model.findOne({
                            parametr1,
                        });

                        if (!znalezionyModel) {
                            message.channel.send(
                                "No matching item found in the database."
                            );
                            return;
                        }

                        znalezionyModel.parametr2 = parametr2;
                        await znalezionyModel.save();

                        const embed = new MessageEmbed()
                            .setTitle("Mongodb")
                            .setDescription("Model name: " + modelName)
                            .addFields(
                                { name: "Before:", value: parametr1 },
                                { name: "After:", value: parametr2 }
                            )
                            .setColor(client.config.color);

                        message.channel.send({ embeds: [embed] });
                    } catch (error) {
                        console.error(error);
                        message.channel.send(
                            "An error occurred while processing the command."
                        );
                    }
                }
                break;
        }
    },
};
