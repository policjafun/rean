const {
    EmbedBuilder,
    Collection,
    PermissionsBitField,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");

const ms = require("ms");
const client = require("../index.js");
const cooldown = new Collection();
const prefix_schema = require("../models/prefix");
const blacklist_schema = require("../models/blacklist");
client.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.isDMBased()) return;

    const blacklisted = await blacklist_schema.findOne();

    let inf = await client.db.prefix.findOne({
        guildId: message.guild.id,
    });

    if (!inf)
        inf = await client.db.prefix.create({
            guildId: message.guild.id,
            prefixes: [`,`],
        });

    let prf;
    for (let prefix of inf.prefixes) {
        if (prefix == undefined) continue;
        if (message.content.startsWith(prefix)) prf = prefix;
    }

    if (
        message.content.startsWith(`<@${client.user.id}>`) ||
        message.content.startsWith(`<@!${client.user.id}>`)
    ) {
        prf = `ping`;


    }

    if (!prf) return;

    message.prefix = prf.replace('ping', `@${client.user.username} `);

    if (prf === `ping`) {

        message.mentions.members?.delete(client.user.id);
        message.mentions.users?.delete(client.user.id);
        message.content = message.content
            .replace(`<@${client.user.id}>`, ``)
            .replace(`<@!${client.user.id}>`, ``);

        if (!message.content.includes(` `)) {
            const embed_replied = new EmbedBuilder()
                .setDescription(
                    "Howdy! im **" +
                    client.user.username +
                    "** if you want help please join the support server by clicking button below"
                )
                .setColor(client.config.color);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("Link").setStyle(ButtonStyle.Link).setURL(client.config.support_url));

            message.reply({ embeds: [embed_replied], components: [row] });

            return;
        }
        message.content = message.content.trim();
    }

    message.content = message.content.replace(prf, ``);
    if (message.content.startsWith(` `))
        message.content = message.content.replace(` `, ``);
    let args = message.content.split(` `);
    let cmd = args.shift().toLowerCase();
    let command =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
    if (!command) return;

    try {
        args.usage = (cmd) => {
            const command =
                client.commands.get(cmd.toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(cmd.toLowerCase())
                );

            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`Wrong command usage!`)
                .addFields([
                    {
                        name: "Usage",
                        value: `${command?.usage?.map((u) => `\`${u}\``).join("\n") ||
                            `\`${command.name}\``
                            }`,
                    },
                    {
                        name: "Description",
                        value: `${command.description}`,
                    },
                ])
                .setFooter({
                    text: "<> - Required * [] - Optional * <X | Y | Z> - Choose",
                });

            return message.reply({ embeds: [embed] });
        };

        args.error = (msg, previous) => {
            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`${msg}`);

            if (previous) {
                return previous.edit({ embeds: [embed] });
            }

            return message.reply({ embeds: [embed] });
        };

        args.success = (msg, previous) => {
            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`${msg}`);

            if (previous) {
                return previous.edit({ embeds: [embed] });
            }

            return message.reply({ embeds: [embed] });
        };

        if (
            client.maintenance &&
            !client.config.devs.includes(message.author.id)
        )
            return args.error(
                "Bot is currently under maintenance. Announcements in our support server."
            );

        if (
            client.disabledCommands.includes(command.name) &&
            !client.config.devs.includes(message.author.id)
        )
            return args.error(
                "This command is currently disabled by neet developers."
            );
        try {
            let disabledCommands = await client.db.command.findOne({
                id: message.guild.id,
            });

            if (disabledCommands?.commands?.includes(command.name)) return;
        } catch (e) {
            console.log(e);
        }

        if (blacklisted.users.includes(message.author.id))
            return message.reply({
                content: `You are blacklisted from using this bot.`,
            });

        if (
            command.developerOnly &&
            !client.config.devs.includes(message.author.id)
        ) {
            return args.error(`This command is only available for developers.`);
        }

        if (command.nsfw && !message.channel.nsfw) {
            return args.error(
                "This command is only available in nsfw channels."
            );
        }

        if (!command.cooldown) command.cooldown = client.config.defaultCooldown;
        if (cooldown.has(`${command.name}${message.author.id}`)) {
            const cooldownEmbed = new EmbedBuilder()
                .setDescription(
                    `*${message.author}, Wait ${ms(
                        cooldown.get(`${command.name}${message.author.id}`) -
                        Date.now(),
                        { long: true }
                    )} before using this command again*`
                )
                .setColor(client.config.color);
            return message.reply({ embeds: [cooldownEmbed] });
        }
        if (command.userPerms || command.clientPerms) {
            if (
                !message.member.permissions.has(
                    PermissionsBitField.resolve(command.userPerms || [])
                ) && !client.config.devs.includes(message.author.id)
            ) {
                return args.error(
                    `You don't have \`${command.userPerms}\` permissions to use this command!`
                );
            }
            if (
                !message.guild.members.cache
                    .get(client.user.id)
                    .permissions.has(
                        PermissionsBitField.resolve(command.clientPerms || [])
                    )
            ) {
                return args.error(
                    `I don't have \`${command.botPerms}\` permissions to use this command!`
                );
            }
        }
        cooldown.set(
            `${command.name}${message.author.id}`,
            Date.now() + command.cooldown
        );
        setTimeout(() => {
            cooldown.delete(`${command.name}${message.author.id}`);
        }, command.cooldown);

        command.run(client, message, args);
    } catch (e) {
        console.log(e);
    }
});
