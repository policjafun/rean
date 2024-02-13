const {
    ChannelType,
    ButtonInteraction,
    AttachmentBuilder,
    escapeCodeBlock,
    codeBlock,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ModalSubmitFields,
    ModalSubmitInteraction,
} = require("discord.js");
const client = require("../index.js");
const { inspect } = require("util");
const { replaceAll } = require("fallout-utility");

client.on("interactionCreate", async (interaction) => {
    const { customId, options } = interaction;

    if (interaction.isModalSubmit()) {
        switch (customId) {
            case "eval_modal":
                const code = interaction.fields.getTextInputValue("eval_code");

                let result = "";
                let error = false;
                if (!client.config.devs.includes(interaction.user.id)) return;
                try {
                    result = inspect(eval(code));
                } catch (err) {
                    result = inspect(err);
                    error = true;
                }

                result = replaceAll(
                    result,
                    client.token,
                    "*".repeat(client.token.length)
                );
                const resutlEmbed = new EmbedBuilder()
                    .setTitle("Evaluated Code")
                    .setDescription(`\`\`\`${escapeCodeBlock(result)}\`\`\``)
                    .setTimestamp()
                    .setColor(client.config.color);
                await interaction.reply({
                    embeds: [resutlEmbed],
                    ephemeral: true,
                });

                interaction.followUp({
                    files: [
                        new AttachmentBuilder(
                            Buffer.from(result, "utf-8")
                        ).setName("Evaluated Code.txt"),
                    ],
                    ephemeral: true,
                });
        }
    } else if (!interaction.isModalSubmit()) {
        return;
    }
});
