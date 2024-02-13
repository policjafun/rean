const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = {
  name: "pagination",
  aliases: ["pagination", "pagination"],
  description: "pagination",
  usage: "test",
  category: "dev",
  developerOnly: true,
  run: async (client, message, args) => {
   
    const pages = [
        new EmbedBuilder().setTitle('1').setDescription('1'),
        new EmbedBuilder().setTitle('2').setDescription('2'),
    ];

    try {
        await pagination(message, pages);
    } catch (error) {
        console.error('Error creating paginator:', error);
    }
  },
};
