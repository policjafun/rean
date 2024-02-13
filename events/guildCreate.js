const whitelistSchema = require("../models/whitelist");
const { EmbedBuilder, Collection, PermissionsBitField } = require("discord.js");
const ms = require("ms");
const client = require("../index.js");

client.on("guildCreate", async (guild) => {
    try {
        const notifychannel = client.guilds.cache.get("1162678576982798366").channels.cache.get("1162812860116770867");

        const whitelistGuildEntry = await whitelistSchema.findOne({
            guildId: guild.id,
        });

        let checkWhitelisted;
        if(!whitelistGuildEntry) {
            checkWhitelisted = "False"
        }
        if(whitelistGuildEntry) {
            checkWhitelisted = "True"
        }

        const notifyEmbed = new EmbedBuilder()
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor(client.config.color)
            .setTitle("New Guild")
            .addFields(
                { name: "GuildId", value: `${guild.id}`, inline: true },
                {
                    name: "Guild Owner ID",
                    value: `${guild.ownerId}`,
                    inline: true,
                },
                { 
                    name: "Guild Name", value: `${guild.name}`, inline: true },
                {
                    name: "Member Count",
                    value: `${guild.memberCount}`,
                    inline: true,
                },
                {
                    name: "Whitelisted",
                    value: `${checkWhitelisted}`,
                    inline: true,
                }
            );

        notifychannel.send({ embeds: [notifyEmbed] });

        if (!whitelistGuildEntry) {
            guild.leave().then(
                notifychannel.send({ embeds: [new EmbedBuilder().setColor('#f73939').setDescription(`Left guild **${guild.name}** (**${guild.id}**) because it was not whitelisted.`)]}),
                guild.systemChannel.send({ embeds: [new EmbedBuilder().setColor('#f73939').setDescription(`I will leave this guild because its not whitelisted, if want to get your guild whitelisted go to our [Support server](https://discord.gg/GTssV4auGH) and make a request at special channel.`)]})
            );
        }
    } catch (error) {
        console.error(error);
        sendError(guild.id, "guildCreate", error);
    }
});
