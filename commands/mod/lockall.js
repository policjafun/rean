const { PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    name: 'lockall',
    aliases: ['lockdownall', 'la'],
    description: 'Lock all channels for all roles',
    category: 'mod',
    usage: ['lockall'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            const guild = message.guild;
            const channels = guild.channels.cache;
            const roles = message.guild.roles.cache
            const botRole = guild.me.roles.highest;
            channels.forEach(channel => {
                try {
                    roles.forEach(role => {
                        try {
                            if (role.id === botRole.id) {
                                return
                            }
                            channel.edit({
                                permissionOverwrites: [
                                    {
                                        id: role.id,
                                        deny: PermissionFlagsBits.SendMessages
                                    }
                                ]
                            });
                        } catch (e) {
                            console.error(`Error while managing permissions for role ${role.name}: ${e}`);
                        }
                    });

                } catch (e) {
                    console.error(`Error while managing permissions for channel ${channel.name}: ${e}`);
                }
            });

            args.success('Locked correctly.');
        } catch (e) {
            console.log(e);
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'lockall', e);
        }
    }
}
