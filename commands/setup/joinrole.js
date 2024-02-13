const { EmbedBuilder } = require('discord.js')
const joinrole_schema = require('../../models/joinrole.js')

module.exports = {
    name: 'joinrole',
    aliases: ['jrole', 'onjoinrole', 'welcomerole'],
    description: 'Set a role to be given to new members when they join the server.',
    category: 'setup',
    usage: ['joinrole <add | remove> <role>'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            const option = args[0]
            const data = await joinrole_schema.findOne({ guildId: message.guild.id })
            
            if(!option && data) {
                if(data.roleId.length > 0) {
                    let roles = data.roleId.map(role => `<@&${role}>`).join(', ');
                    const embed = new EmbedBuilder()
                        .setTitle('Joinrole List')
                        .setDescription(roles)
                        .setColor(client.config.color)
                    message.reply({ embeds: [embed] })
                } else {
                    args.error('There are no roles in the joinrole list.')
                }
            } else if(!option && !data) {
                args.error('There are no roles in the joinrole list.')
            }

            switch(option) {
                case 'add': {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                    if(!role) return args.error('Please provide a valid role.')

                    if(data) {
                        if(data.roleId.includes(role.id)) return args.error('This role is already in the joinrole list.')
                        data.roleId.push(role.id)
                        data.save()
                        args.success(`Successfully added ${role} to the joinrole list.`)
                    } else {
                        const newData = new joinrole_schema({
                            guildId: message.guild.id,
                            roleId: [role.id]
                        })
                        newData.save()
                        args.success(`Successfully added ${role} to the joinrole list.`)
                    }
                } break;
                case 'remove': {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                    if(!role) return args.error('Please provide a valid role.')
                    if(!data.roleId.includes(role.id)) return args.error('This role is not in the joinrole list.')

                    if(data) {
                        if(!data.roleId.includes(role.id)) return args.error('This role is not in the joinrole list.')
                        data.roleId.splice(data.roleId.indexOf(role.id), 1)
                        data.save()
                        args.success(`Successfully removed ${role} from the joinrole list.`)
                    } else {
                        args.error('There are no roles in the joinrole list.')
                    }
                } break;
            }
        } catch(e) {
            console.log(e)
            args.error('An error occurred while running this command.')
        }
    }
}