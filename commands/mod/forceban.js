const { EmbedBuilder } = require("discord.js");
const forceban_schema = require("../../models/forceban");
module.exports = {
    name: "forceban",
    aliases: ["fban"],
    description: "Forceban a user",
    category: "mod",
    usage: ["forceban <id> [reason]"],
    userPerms: ["BanMembers"],
    clientPerms: ["BanMembers"],
    run: async (client, message, args) => {
        try {
            const member = message.guild.members.cache.get(args[0]);
            if (args[0]) {
                if (member) {
                    const reason =
                        args.slice(1).join(" ") || "*No reason provided*";
                    if (
                        member.roles.highest.position >=
                        message.member.roles.highest.position
                    )
                        return args.error(`You can't mute this user!`);
                    if (!member.bannable)
                        return message.reply(`I can't ban this user!`);
                    if (member.id === message.author.id)
                        return message.reply(`You can't ban yourself!`);
                    if (member.id === client.user.id)
                        return message.reply(`You can't ban me!`);

                    await member.ban({ reason: reason });

                    const embed = new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("Force banned!")
                        .setThumbnail(
                            member.user.displayAvatarURL({
                                dynamic: true,
                                size: 4096,
                            })
                        )
                        .setFields([
                            {
                                name: "Reason",
                                value: reason,
                                inline: true,
                            },
                        ]);
                    const b = await forceban_schema.findOne({ user_id: args[0] });
                    if (b) {
                        return args.error("This user is already in database");
                    } else {
                        const newForceban = new forceban_schema({
                            user_id: args[0],
                            guild_id: message.guild.id,
                            moderator_id: message.author.id,
                        });
                        await newForceban.save();
                        message.reply({ embeds: [embed] });
                    };
                } else {
                    const a = await forceban_schema.findOne({ user_id: args[0] });
                    if (a) {
                        return message.reply("This user was banned already");
                    } else {
                        const newForceban = new forceban_schema({
                            user_id: args[0],
                            guild_id: message.guild.id,
                            moderator_id: message.author.id,
                        });
                        await newForceban.save();
                    }
                }
            }
        } catch (e) {
            console.log(e);
            args.error("An error occurred while executing the command");
            sendError(message.guild.id, "forceban", e);
        }
    },
};
