const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
module.exports = {
  name: "test",
  aliases: ["test_canvas", "cv"],
  description: "test",
  usage: "test",
  category: "dev",
  run: async (client, message, args) => {
    const canvas = createCanvas(680, 240);
    const ctx = canvas.getContext("2d");
    const applyText = (canvas, text) => {
      const ctx = canvas.getContext("2d");
      let fontSize = 150;
      do {
        ctx.font = `${(fontSize -= 2)}px Gilgan`;
      } while (ctx.measureText(text).width > canvas.width - 500);
      return ctx.font;
    };
    registerFont(path.join(__dirname, '../../fonts/oligan/gilgan.otf'), { family: 'Gilgan' });
    const imageUrl = "https://media.discordapp.net/attachments/1163073675541610506/1165378457518211144/image0.jpg?ex=6546a243&is=65342d43&hm=1e25d43584be7f780fe397468def0ae8703f3ac161a100855b18215634be7c3e&=";
    const background = await loadImage(imageUrl);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.font = "20px Gilgan";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Welcome to ${message.guild.name}`, 141, 46);
    ctx.font = "13px Gilgan";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`You are #${message.guild.memberCount} member!`, 141, 70);
    ctx.font = "11px Gilgan";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Powered by rean.`, 579, 233);
    ctx.beginPath();
    ctx.arc(60, 60, 44, 0, Math.PI * 2, true); 
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(60, 60, 42, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
  
    const result = canvas.toBuffer();
    const attachment = new AttachmentBuilder(result, "New_Member.png");
    let embed = new EmbedBuilder()
      .setTitle("Welcome New Member!")
      .setImage("attachment://" + attachment.name);
    message.reply({ embed: embed, files: [attachment] });
  },
};