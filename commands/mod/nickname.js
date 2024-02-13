const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "nickname",
    aliases: ["nick", "name", "nickname"],
    description: "Change the nickname for a user",
    category: "mod",
    usage: ["nickname <user> <new_nickname> "],
    userPerms: ["ManageNicknames"],
    clientPerms: ["ManageNicknames"],
    run: async (client, message, args) => {
        try {

            let member1;
            if(!args[1]) {
                if(args[0] == findUser(message, args[0])) {
                    member1 = findUser(message, args[0])

                    user = client.users.cache.get(member1.id)
                } else {
                    member1 = message.member;
                    user = message.author;
                }
            } else {
                member1 = findUser(message, args[0])
                user = client.users.cache.get(member1.id)
            }   

            if(!member1.manageable) return args.error('No permissions');
            const embed = new EmbedBuilder()
                .setFields(
                    {
                        name: "Nickname",
                        value: `${args.join(' ').replace(args[0], '') || user.username}`,
                    }
                )
                .setColor(client.config.color)
                .setDescription(
                    `I've changed nickname for this ${member1.username}!`
                );
            member1.setNickname(
                `${args.join(' ').replace(args[0], '') || user.username}`,
                "new cool nick"
            );
            message.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            message.channel.send("An error occurred.");
            sendError(message.guild.id, "nickname", e);
        }
    },
};
