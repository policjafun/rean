const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    aliases: ['help', 'h'],
    description: 'Get help',
    category: 'info',
    usage: ['help <command>'],
    cooldown: 3,
    run: async (client, message, args) => {
        try {
            if (!args[0]) {
                let subCommands = 0;
                let categories = [];

                fs.readdirSync('./commands/').forEach((dir) => {
                    if (dir === 'dev') return;

                    const commands = fs
                        .readdirSync(`./commands/${dir}/`)
                        .filter((file) => file.endsWith('.js'));

                    const cmds = commands.map((command) => {
                        let file = require(`../../commands/${dir}/${command}`);

                        if (!file.name) return 'No command name.';

                        let name = file.name.replace('.js', '');

                        if (file.usage?.length !== undefined) subCommands += file.usage?.length;

                        return `\`${name}\``;
                    });

                    data = {
                        name: dir.charAt(0).toUpperCase() + dir.slice(1),
                        value: cmds.length === 0 ? 'In progress.' : cmds.join(', '),
                    };
                    categories.push(data);
                });

                const pages = categories.map((category) => {
                    return new EmbedBuilder()
                        .addFields(category)
                        .setDescription(
                            `Hey, this is my ${client.commands.size} commands. To get additional information about a specific category, type \`${message.prefix}help <command>\` to check.`
                        )
                        .setColor(client.config.color);
                });

                await pagination(message, pages);
            } else {

                const cmd = args[0];
                const command =
                    cmd &&
                    (client.commands.get(cmd.toLowerCase()) ||
                        client.commands.find(
                            (c) => c.aliases && c.aliases.includes(cmd.toLowerCase())
                        ));
                if (!command) return args.error('Not found this command.');

                const aliaes = command.aliases.join(', ');
                const usage = `${command?.usage?.map((u) => `${u}`).join('\n') || `${command.name}`}`;
                const desc = command.description;
                const name = command.name;
                const cat = command.category;
                const embed = new EmbedBuilder()
                    .setFields(
                        { name: `Name`, value: `${name}`, inline: true },
                        { name: `Category`, value: cat, inline: true },
                        { name: `Description`, value: desc, inline: true },
                        { name: `Aliases`, value: "```Aliases: " + aliaes + "```" },
                        { name: "Usage", value: "```" + usage + "```" }
                    )
                    .setColor(client.config.color)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
                message.reply({ embeds: [embed] });
            }
        } catch (e) {
            console.log(e);
            args.error('An error occurred while executing the command');
            sendError(message.guild.id, 'help', e);
        }
    },
};
