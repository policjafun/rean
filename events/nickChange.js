const forcenickname_schema = require("../models/forcenickname");
const { EmbedBuilder, Collection, PermissionsBitField } = require("discord.js");
const ms = require("ms");
const client = require("../index.js");

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const data = await forcenickname_schema.findOne({
        user_id: newMember.id,
        guild_id: newMember.guild.id,
    })
    if(!data) return;
    newMember.setNickname(data.nickname)
});
