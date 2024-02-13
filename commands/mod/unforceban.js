const Discord = require('discord.js');
const forceban_schema = require('../../models/forceban');

module.exports = {
    name: "unforceban",
    aliases: ["unfban", "ufb"],
    description: "Unforceban a user",
    category: "mod",
    usage: ["unforceban <id>"],
    userPerms: ["BanMembers"],
    clientPerms: ["BanMembers"],
    run: async (client, message, args) => {
        try {
            if (args[0]) {
                try {
                    const bannedUsers = await message.guild.bans.fetch();
                    const targetUser = bannedUsers.find(user => user.user.id === args[0]);

                    if (targetUser) {
                        await forceban_schema.findOneAndDelete({ user_id: args[0], guild_id: message.guild.id });
                        await message.guild.bans.remove(targetUser.user);
                        
                        const correct_embed = new Discord.EmbedBuilder()
                            .setDescription("User unblocked")
                            .setColor(client.config.color);
                        message.reply({ embeds: [correct_embed] });
                    } else {
                        args.error("This user is not banned");
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                args.error('Pls id of the user');
            }
        } catch (e) {
            console.error(e);
            args.error("An error occurred.");
            sendError(message.guild.id, "unforceban", e);
        }
    }
}
