
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    name: 'screenshot',
    aliases: ['ss'],
    description: 'Get a screenshot of a website and measure the time it takes.',
    category: 'utils',
    usage: ['screenshot <url>'],
    cooldown: 10000,
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('Usage: screenshot <url>');

        const startTime = new Date();

        try {
            const website = args[0];
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.goto(website);
            await page.setViewport({ width: 1920, height: 1080 });

            const screenshot = await page.screenshot();
            await browser.close();
            const buffer = Buffer.from(screenshot, 'base64');
            const attachment = new AttachmentBuilder(buffer, { name: 'screenshot.png' });
            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`[**site**](${website})`)
                .setImage('attachment://screenshot.png');

            const endTime = new Date();
            const executionTime = (endTime - startTime) / 1000;
            embed.setDescription(`[**site**](${website}), took: **${executionTime.toFixed(2)}**s`);

            message.reply({ embeds: [embed], files: [attachment] });
        } catch (e) {
            console.log(e)
            const warning_embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(":warning: Try with valid url.");
            message.reply({ embeds: [warning_embed] });
        }
    }
};

