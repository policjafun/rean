const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'role',
    aliases: ['r', 'giverole', 'role', 'addrole'],
    description: 'Give a role to a user',
    category: 'mod',
    usage: ['role <user> <role>'],
    userPerms: ['ManageRoles'],
    clientPerms: ['ManageRoles'],
    run: async (client, message, args) => {
        try {
            let user;
            let member;
            if(!args[0]) return args.usage('role')
            if(!args[1]) return args.usage('role')
            try {
                if (args[0] == message.mentions.users.first() || findUser(message, args[0])) {
                    user = findUser(message, args[0]);
                    member = message.guild.members.cache.get(user.id);
                } else {
                    user = message.author;
                    member = message.member;
                }
            } catch (err) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setDescription(
                        `I cant find that user!`
                    );

                return message.reply({
                    embeds: [embed],
                });
            }
            await user.fetch();

            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[1].toLowerCase()))
            if (!role) return args.usage('role')
            
            
            if (message.member.roles.highest.position <= role.position) return args.error(`You can't do that`)
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id)
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setDescription(
                        `I removed ${member.user.username} a role: ${role}`
                    );

                return message.reply({
                    embeds: [embed],
                });
            };
            if (role.managed) return args.error(`I can't give this role to user!`)
            if (!role.editable) return args.error(`I can't give this role to user!`)

            if(!member.roles.cache.has(role.id)) {
                await member.roles.add(role.id)
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setDescription(
                        `I gave ${member.user.username} a role: ${role}`
                    );

                message.reply({
                    embeds: [embed],
                });
            }

        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'role', e)
        }
    }
}