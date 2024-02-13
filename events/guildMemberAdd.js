const { EmbedBuilder } = require('discord.js')
const client = require("../index.js");
const forceban_schema = require('../models/forceban')
const joinrole_schema = require('../models/joinrole')

client.on('guildMemberAdd', async (member) => {
    const x = await forceban_schema.findOne({
        user_id: member.id,
        guild_id: member.guild.id
    })

    if(!x) {
        return;
    } else {
      member.ban({ reason: `Forceban, Mod: ${x.moderator_id}` })
    }
});

client.on('guildMemberAdd', async(member) => {
    if(member.user.bot) return;
    const data = await joinrole_schema.findOne({ guildId: member.guild.id })
    if(!data) return;
    if(data.roleId.length > 0) {
        data.roleId.forEach(role => {
            member.roles.add(role)
        })
    } else return;
})