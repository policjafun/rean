const { EmbedBuilder, PermissionFlagsBits, ContextMenuCommandAssertions } = require("discord.js");

module.exports = {
    name: "banlist",
    aliases: ["blist", "banlist"],
    description: "List of bans",
    category: "mod",
    usage: ["banlist"],
    userPerms: ["BanMembers"],
    clientPerms: ["BanMembers"],
    run: async (client, message, args) => {
        try {
            const guild = message.guild;


            const banList = await guild.bans.fetch();

           
            const embed = new EmbedBuilder()
                .setTitle("List of Banned Users")
                .setColor(client.config.color); 

            banList.forEach((banInfo) => {
                const user = banInfo.user;
                embed.setDescription(`${("ID"+user.id) || "no bans"} Reason: ${banInfo.reason || "No reason provided"}\n`);
            });

    
        } catch(e) {
            console.error(e);
            message.channel.send("An error occurred.");
            sendError(message.guild.id, "banlist", e);
        }
    }
};
