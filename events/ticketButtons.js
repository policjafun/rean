const {
    EmbedBuilder,
    ModalBuilder,
    ButtonBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    AttachmentBuilder,
    UserSelectMenuBuilder,
    ChannelType,
    PermissionFlagsBits,
    ButtonStyle,
    StringSelectMenuBuilder,
} = require("discord.js");
const client = require("../index.js");
const ticketModel = require("../models/ticket.js");

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId == "tickets_settings_name") {
        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(
                "U can now only set the tickets name for **ticket_{user_name}** or **ticket_{user_id}**"
            );
        const string_select_menu = new StringSelectMenuBuilder()
            .setPlaceholder("Select the ticket name")
            .addOptions(
                {
                    label: "ticket_{user_name}",
                    value: "ticket_username",
                    description: "Ticket and the username",
                },
                {
                    label: "ticket_{user_id}",
                    value: "ticket_userid",
                    description: "Ticket and the id of the user",
                }
            )
            .setCustomId("ticket_name_select_menu");
        const row = new ActionRowBuilder().addComponents(string_select_menu);

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });
    }

    if (interaction.customId == "open_ticket_button") {
        const { guild, member } = interaction;
        const channels = await interaction.guild.channels.fetch();
        const embed = new EmbedBuilder()
            .setDescription(
                `Hey, feel free to describe your issue in details, and our support team will assist you promptly.`
            )
            .addFields({ value: `${member.user.id}`, name: `ID`, inline: true })
            .setColor(client.config.color);

        const confirm = new ButtonBuilder()
            .setCustomId("rm_ticket")
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger);
        const confirm1 = new ButtonBuilder()
            .setCustomId("transcript_ticket")
            .setLabel("Transcript")
            .setStyle(ButtonStyle.Primary);
        const addUser = new ButtonBuilder()
            .setCustomId("add_user_ticket")
            .setLabel("Add User")
            .setStyle(ButtonStyle.Success);
        const removeUser = new ButtonBuilder()
            .setCustomId("remove_user_ticket")
            .setLabel("Remove User")
            .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(
            confirm,
            confirm1,
            addUser,
            removeUser
        );

        const channelName = `ticket_${interaction.user.id}`;
        const ticketData = await ticketModel.findOne({ guildId: guild.id });

        const channelOptions = {
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: member.user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.guildId,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        };

        if (
            ticketData &&
            ticketData.settings &&
            ticketData.settings.oneticketbyuser === true
        ) {
            const existingTicketChannel = guild.channels.cache.find(
                (channel) =>
                    channel.name.startsWith("ticket_") &&
                    channel.members.has(member.user.id)
            );
            if (existingTicketChannel) {
                return interaction.reply({
                    content: "You already have an opened ticket.",
                    ephemeral: true,
                });
            }
        }
        interaction.guild.channels.create(channelOptions).then((channel) => {
            channel.send({ embeds: [embed], components: [row] });
            try {
                if (ticketData.modRoleId) {
                    const role = interaction.guild.roles.cache.get(
                        ticketData.modRoleId
                    );
                    if (role) {
                        channel.permissionOverwrites.create(role, {
                            ViewChannel: true,
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
        interaction.reply({ content: "Ticket created!", ephemeral: true });
    } else if (interaction.customId == "rm_ticket") {
        const currentTime = Math.floor(Date.now() / 1000);
        const timestamp = currentTime + 10;

        interaction.reply({
            content: `The ticket will be deleted in: <t:${timestamp}:R>`,
            ephemeral: true,
        });
        setTimeout(async () => {
            if (interaction.channel) {
                await interaction.channel.delete();
            }
        }, 10000);
    } else if (interaction.customId == "transcript_ticket") {
        const ticketData = await ticketModel.findOne({
            guildId: interaction.guild.id,
        });
        if (ticketData && ticketData.modRoleId) {
            if (
                !interaction.member.roles.cache.has(ticketData.modRoleId)
            ) {
                return interaction.reply({
                    content: "You don't have permission to use this button",
                    ephemeral: true,
                });
            }
        }

        const channel = interaction.channel;
        await channel.messages.fetch({ cache: true });
        const atc = new AttachmentBuilder(
            Buffer.from(
                channel.messages.cache
                    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
                    .map(
                        (msg) =>
                            `[${new Date(
                                msg.createdTimestamp
                            ).toLocaleDateString("pl-PL", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}] ${msg.author.tag}: ${msg.content}`
                    ).join("\n")
            ),
            {
                name: `ticket-${interaction.user.username}.txt`,
            }
        );
        const author = interaction.user;
        author.send({
            files: [atc],
        });
        interaction.reply({ content: "Transcript sent", ephemeral: true });
    } else if (interaction.customId == "add_user_ticket") {
        const row = new ActionRowBuilder();
        const selectmenu = new UserSelectMenuBuilder()
            .setCustomId("ticket_add_user_selectmenu")
            .setPlaceholder("Select user");
        row.addComponents(selectmenu);
        interaction.reply({ components: [row] });
    } else if (interaction.customId == "remove_user_ticket") {
        const row = new ActionRowBuilder();
        const selectmenu = new UserSelectMenuBuilder()
            .setCustomId("ticket_remove_user_selectmenu")
            .setPlaceholder("Select user");
        row.addComponents(selectmenu);
        interaction.reply({ components: [row] });
    }
    if (interaction.customId == "ticket_add_user_selectmenu") {
        const user = interaction.values[0];
        if (!user) return interaction.reply("No user to add");
        const channel = interaction.channel;
    
        const user1 = await interaction.guild.members.fetch(user);
        if (channel.permissionOverwrites.cache.has(user1.id)) {
            return interaction.reply({
                content: "User already has permission to view this channel",
                ephemeral: true,
            });
        }
        channel.permissionOverwrites.create(user1, { ViewChannel: true });
        interaction.reply({ content: "Added the user", ephemeral: true });
    } else if (interaction.customId == "ticket_remove_user_selectmenu") {
        const user = interaction.values[0];
        if (!user) return interaction.reply("No user to remove");
        const user1 = interaction.guild.members.cache.get(user);
        const channel = interaction.channel;

        channel.permissionOverwrites.delete(
            user1.id,
            "user deleted from the channel"
        );

        interaction.reply({ content: "Removed the user", ephemeral: true });
    }
});
