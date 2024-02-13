const { EmbedBuilder } = require("discord.js");
const blacklist_schema = require("../../models/blacklist");

module.exports = {
    name: "blacklist",
    aliases: ["botban", "bban"],
    description: "Blacklist a user from using the bot.",
    category: "dev",
    usage: ["blacklist <user>"],
    userPerms: ["Administrator"],
    clientPerms: ["Administrator"],
    developerOnly: true,
    run: async (client, message, args) => {
        try {
            if (!args[0]) return args.usage("blacklist");

            let userId = args[0]; 

            const user = message.mentions.members.first() || message.guild.members.cache.get(userId);

            if (!user) {
                userId = args[0];
            }

            const blacklist = await blacklist_schema.findOne();

            if (client.config.devs.includes(userId)) return args.error("You can't blacklist a developer.");

            if (!blacklist.users.includes(userId)) {
                blacklist.users.push(userId);
                await blacklist.save();
                args.success(`Blacklisted user with ID **${userId}** from using the bot.`);
            } else {
                blacklist.users.splice(blacklist.users.indexOf(userId), 1);
                await blacklist.save();
                args.success(`Removed blacklist from user with ID **${userId}**.`);
            }
        } catch (e) {
            console.log(e);
            args.error(`An error occurred while running this command.`);
        }
    },
};
