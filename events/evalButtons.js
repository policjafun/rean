const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder,  ModalBuilder, TextInputBuilder, TextInputStyle  } = require('discord.js');
const client = require('../index.js');

client.on('interactionCreate', async (interaction) => {
if(interaction.isButton()){
    if(interaction.customId === "eval_code_button") {
        if (!client.config.devs.includes(interaction.user.id)) return;
        const modal = new ModalBuilder()
        .setCustomId('eval_modal')
        .setTitle('Eval Javascript code');
        
        const text = new TextInputBuilder()
        .setCustomId('eval_code')
        .setLabel("Enter code here.")
        .setStyle(TextInputStyle.Paragraph);
        
        const secondActionRow = new ActionRowBuilder().addComponents(text);
        
        modal.addComponents(secondActionRow);
        interaction.showModal(modal);
    }
}

});