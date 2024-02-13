const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "unroleall",
    aliases: ["urolea", "ura", "unroleall"],
    description: "Removing role from all members",
    category: "mod",
    usage: ["unroleall <@role>"],
    cooldown: 3,
    userPerms: ['Administrator'],
    clientPerms: ['Administrator'],
    run: async (client, message, args) => {
        const error_embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(`Something went wrong`)
        const embed_1 = new EmbedBuilder()

            .setDescription("Removing roles...")
            .setColor(client.config.color)
        const m1 = await message.reply({ embeds: [embed_1] })
        try {
            const start_time = new Date();
           
            const correct_embed = new EmbedBuilder()
                .setColor(client.config.color);
            const role = message.mentions.roles.first();
            if (message.member.roles.highest.position <= role.position) return args.error(`You can't do that`)
            var licznik = 0;
            if (role.editable) {
                const users = message.guild.members.cache;
                users.forEach((x) => {
                    try {
                        x.roles.remove(role).catch((e) => console.error(e));
                        licznik++;
                    } catch (e) {
                        console.log(e);
                    }
                });
                const end_time = new Date();
                const timeDifference = end_time - start_time;
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const formattedTime =
                    `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}` +
                    `${minutes % 60 > 0 ? `${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''} ` : ''}` +
                    `${seconds % 60} second${seconds % 60 > 1 ? 's' : ''}`;
                correct_embed.setDescription(`Succefully removed <@&${role.id}> from all users on this server`)
                correct_embed.setFields(
                    { name: "Time", value: formattedTime },
                    { name: "Users", value: `${licznik} ` },
                );
                m1.edit({ embeds: [correct_embed] });
            } else {
                m1.edit({ embeds: [error_embed] })
            }
        } catch (e) {
            console.log(e);
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, "unroleall", e);
        }
    },
};
