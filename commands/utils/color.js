const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const getColors = require('get-image-colors');
const { createCanvas, loadImage } = require('canvas');
module.exports = {
    name: 'color',
    aliases: ['color', 'hex', 'ihex', 'findcolor'],
    description: 'Wyszukuje główny kolor na przesłanym obrazie.',
    category: 'utils',
    usage: [''],
    cooldown: 10,
    run: async (client, message, args) => {
        if (message.attachments.size < 1) {
            return args.error('Not found attachment')
        }
        const attachment = message.attachments.first();

        try {
            const colors = await getColors(attachment.url);

            if (colors.length === 0) {
                return args.error('No colors found')
            }

            const mainColor = colors[0].hex();

            const canvas = createCanvas(100, 100);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = mainColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

          
            const attachmentFromCanvas = new AttachmentBuilder(canvas.toBuffer(), { name: 'kolor.png' });


            const embed = new EmbedBuilder()
                .setColor(client.config.color) 
                .setTitle(`hex: **${mainColor}**`)
                .setImage('attachment://kolor.png'); 

            message.reply({ embeds: [embed],files: [attachmentFromCanvas] })

        } catch (error) {
            console.error(error);
            message.reply('Wystąpił błąd podczas analizowania obrazu.');
        }
    }
};
