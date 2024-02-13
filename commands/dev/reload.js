const Discord = require('discord.js');

module.exports = {
    name: 'reload',
    aliases: ['rl'],
    description: 'Reloads commands',
    userPerms: [],
    botPerms: [],
    developerOnly: true,
    usage: ['reload'],
    run: async (client, message, args) => {
        if(args[0] !== '*') {
            if (!args[0]) return args.error('No command given.');
            if (!client.commands.has(args[0])) return args.error('Invalid command.');
        }
        require('../../handlers/command')(client);
        return args.success(
            args[0] !== '*'
                ? `Reloaded \`rean.core.commands.${args[0] || "*"}\``
                : `Reloaded \`rean.core.commands.*\``
        );
    },
};
