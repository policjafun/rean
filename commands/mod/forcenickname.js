const { EmbedBuilder } = require("discord.js");
const forcenickname_schema = require("../../models/forcenickname");

module.exports = {
    name: "forcenickname",
    aliases: ["fnickname", "fnick", "forcenick", "fn"],
    description: "Keep a nickname for a user",
    category: "mod",
    usage: ["forcenickname <user> <nickname>"],
    userPerms: ["ManageNicknames"],
    clientPerms: ["ManageNicknames"],
    run: async (client, message, args) => {
        try {
            const member =
                message.mentions.members.first() || findUser(message, args[0])
            const user = client.users.cache.get(member.id);

            if (!member) return args.error("Member not found");
            if (args[1]) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setDescription(
                        "I've changed nickname for this user and he won't be able to change it!"
                    );

                data = await forcenickname_schema.findOne({
                    guild_id: message.guild.id,
                    user_id: member.id,
                });

                if(!data) {
                    const datatosave = new forcenickname_schema({
                        guild_id: message.guild.id,
                        user_id: member.id,
                        nickname: args.join(' ').replace(args[0], '')
                    })
                   await datatosave.save()
                } else {
                    data.nickname = args.join(' ').replace(args[0], '')
                    await data.save()
                }

                message.reply({ embeds: [embed] });
                member.setNickname(
                    `${args.join(' ').replace(args[0], '') || member.globalName}`,
                    "new cool nick"
                );

            } else {
                const data = await forcenickname_schema.findOne({
                    guild_id: message.guild.id,
                    user_id: member.id,
                });
                if (data) {
                    args.success(
                        "Successfully removed the force nickname from this user"
                    );
                    member.setNickname(user.globalName, "removed force nick");
                    await forcenickname_schema.findOneAndDelete({
                        user_id: member.id,
                        guild_id: message.guild.id,
                    });
                } else {
                    args.error("This user doesn't have a force nickname");
                }
            }
        } catch (e) {
            args.error("An error occurred while executing the command");
            console.log(e);
            sendError(message.guild.id, "forcenickname", e);
        }
    },
};
