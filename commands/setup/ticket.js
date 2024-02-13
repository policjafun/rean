const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChannelType
} = require("discord.js");
const ticket_schema = require('../../models/ticket')
const ticket_button_data = require('../../models/ticket_buttondata')
const ticket_messagedata = require('../../models/ticket_messagedata')

module.exports = {
    name: "ticket",
    aliases: ["ticket"],
    cooldown: 3000,
    description: "Setup tickets",
    category: "setup",
    usage: [
        "ticket send <#channel>",
        "ticket message <inputInJson>",
        "ticket modrole <@role>",
        "ticket category <@category>",
        "ticket logs <#channel>",
        "ticket button <label | style | emoji> <input>",
        "ticket settings <oneperuser> <true | false>"
    ],
    userPerms: ["ManageGuild"],
    botPerms: ["ManageGuild"],
    run: async (client, message, args) => {
        try {
            console.log(args[0])
        
            if (args[0]) {
                switch (args[0].toLowerCase()) {
                    case "settings": {
                        if (!args[1]) return args.usage('ticket')
                        if(!args[2]) return console.log("jebac anie")
                        switch (args[2].toLowerCase()) {
                            case "oneperuser": { 
                                const embed = new EmbedBuilder() 
                                .setColor(client.config.color)
                                const data = await ticket_schema.findOne({ guildId: message.guild.id });
                                if (data.settings) {
                                    data.settings.onePerUser = args[2] === 'true';
                                } else {
                                    data.settings = {
                                        onePerUser: args[2] === 'true'
                                    };
                                }
                                await data.save();
                                if (!data) {
                                    data = new ticket_schema({
                                        guildId: message.guild.id,
                                        settings: {
                                            onePerUser: args[2] === 'true'
                                        }
                                    });
                                } else {
                                    data.settings.onePerUser = args[2] === 'true';
                                }
                                await data.save();
                                message.reply({ embeds: [embed]})

                            } break;

                        }
                    } break;


                    case "category": {
                        if (!args[1]) return args.usage('ticket')
                        let category = message.guild.channels.cache.get(args[1]);
                        if (!category) return args.error('Category not found')
                        if (!(category.type === ChannelType.GuildCategory)) return args.error("That is not a category")
                        let data = await ticket_schema.findOne({ guildId: message.guild.id });

                        if (!data) {
                            data = new ticket_schema({
                                guildId: message.guild.id,
                                categoryId: category.id
                            });
                        } else {
                            data.categoryId = category.id;
                        }

                        await data.save();
                        args.success("Successfully set the category.")
                    } break;
                    case "send": {
                        const channel = message.mentions.channels.first();
                        if (!channel) return args.error("Musisz oznaczyć kanał!");
                        const messageData = await ticket_messagedata.findOne({ guildId: message.guild.id });
                        const buttonsData = await ticket_button_data.findOne({ guildId: message.guild.id });
                        if (!messageData || !buttonsData) return args.error("please configurate first ticket message and ticket button");
                        const embed = new EmbedBuilder()
                            .setTitle(messageData.title || null)
                            .setDescription(messageData.description?.replace("\n", /\n/g) || null)
                            .setImage(messageData.imageURL || null)
                            .setAuthor(messageData.authorText || null, messageData.authorURL || null)
                            .setFooter({ text: messageData.footerText || null, iconURL: messageData.footerURL || null })
                            .setThumbnail(messageData.thumbnail || null)
                            .setColor(messageData.color || client.config.color);
                        const button = new ButtonBuilder();
                        button.setCustomId("open_ticket_button")
                        for (const field in buttonsData) {
                            if (buttonsData[field]) {
                                switch (field) {
                                    case 'label':
                                        button.setLabel(buttonsData[field]);
                                        break;
                                    case 'style':
                                        button.setStyle(buttonsData[field]);
                                        break;
                                    case 'emoji':
                                        button.setEmoji(buttonsData[field]);
                                        break;
                                }
                            }
                        }

                        const actionRow = new ActionRowBuilder().addComponents(button);
                        channel.send({ embeds: [embed], components: [actionRow] });
                    } break;
                    case "message": {
                        try {
                            const input = args.slice(1).join(" ");
                    
                            const embed = new EmbedBuilder()
                    
                            const messageData = await ticket_messagedata.findOne({ guildId: message.guild.id })
                    
                            if (!args[1] && messageData) {
                                const ticketData = await ticket_messagedata.findOne({ guildId: message.guild.id })
                    
                                embed
                                    .setTitle(ticketData.title || null)
                                    .setDescription(ticketData.description.replace(/\n/g, "\n") || null)
                                    .setImage(ticketData.imageURL || null)
                                    .setAuthor(ticketData.authorText || null, ticketData.authorURL || null)
                                    .setFooter({ text: ticketData.footerText || null, iconURL: ticketData.footerURL || null})
                                    .setThumbnail(ticketData.thumbnail || null)
                                    .setColor(ticketData.color || client.config.color)
                    
                                message.reply({ embeds: [embed] })
                            } else if (!args[1] && !messageData) {
                                args.error(`You didn't set any message data. Please use \`${client.config.prefix}ticket message <inputInJson>\` to set the message data.`)
                            } else if (args[1]) {
                                let parse;
                                try {
                                    parse = JSON.parse(input);
                                } catch (e) {
                                    args.error('Invalid JSON format. Please provide valid JSON like: **{ "title": "test" }** ');
                                    return;
                                }
                                const fields = ["title", "description", "imageURL", "authorText", "authorURL", "footerText", "footerURL", "thumbnail", "color"];
                    
                                let messageData = await ticket_messagedata.findOne({ guildId: message.guild.id });
                    
                                if (!messageData) {
                                    messageData = new ticket_messagedata({
                                        guildId: message.guild.id,
                                    });
                                }
                    
                                for (const field of fields) {
                                    if (parse[field]) {
                                        await messageData.updateOne({ [field]: parse[field] });
                                        if (field === "color") {
                                            const hexColor = parse[field].replace(/[^0-9a-fA-F]/g, '');
                                            if (hexColor.length !== 6) {
                                                args.error("Invalid hex color code. Please provide a valid 6-digit hex color code.");
                                                return;
                                            }
                                            parse[field] = "#" + hexColor;
                                        }
                                        await messageData.save();
                                    }
                                }
                                args.success("Successfully set the message data.")
                            }
                        } catch (e) {
                            console.error(e);
                            message.channel.send("An error occurred while processing the input.");
                        }
                    } break;                    
                    case "modrole": {
                        if (!args[1]) return args.usage('ticket')
                        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                        if (!role) return args.error('Role not found')

                        let data = await ticket_schema.findOne({ guildId: message.guild.id });

                        if (!data) {
                            data = new ticket_schema({
                                guildId: message.guild.id,
                                modRoleId: role.id
                            });
                        } else {
                            data.modRoleId = role.id;
                        }

                        await data.save();
                        args.success("Successfully set the mod role.")
                    } break;
                    case "logs": {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                        if (!args[1]) args.usage('ticket')
                        if (!channel) return args.error('Channel not found')

                        let data = await ticket_schema.findOne({ guildId: message.guild.id });

                        if (!data) {
                            data = new ticket_schema({
                                guildId: message.guild.id,
                                logsChannelId: channel.id
                            });
                        } else {
                            data.logsChannelId = channel.id;
                        }

                        await data.save();
                        args.success("Successfully set the logs channel.")
                    } break;
                    case "button": {
                        if (!args[1]) return args.usage('ticket')
                        const input1 = args[1]

                        const buttonsData = await ticket_button_data.findOne({ guildId: message.guild.id })

                        switch (input1) {
                            //label | style | emoji 
                            case 'label': {
                                const input2 = args.join(' ').replace(args[0], '').replace(args[1], '').trimStart();
                                console.log(input2)
                                if (!input2.length > 80) return args.error("Label must be less than 80 characters.")

                                if (!buttonsData) {
                                    const newData = new ticket_button_data({
                                        guildId: message.guild.id,
                                        label: input2
                                    });
                                    newData.save();
                                } else if (buttonsData) {
                                    buttonsData.label = input2
                                    buttonsData.save();
                                }
                                args.success("Successfully set the label of the button.")
                            } break;
                            case 'style': {
                                if (!args[2]) return args.usage('ticket')
                                style = args[2].toLowerCase();
                                const styleMapping = {
                                    "primary": 1,
                                    "secondary": 2,
                                    "success": 3,
                                    "danger": 4
                                };

                                if (!styleMapping[style]) {
                                    const embed = new EmbedBuilder()
                                        .setDescription("Invalid style. Valid styles are `primary, secondary, success, danger `")
                                        .setColor(client.config.color)
                                    const buttonPrimary = new ButtonBuilder()
                                        .setStyle(1)
                                        .setCustomId('neet1')
                                        .setLabel('primary')
                                    const buttonSecondary = new ButtonBuilder()
                                        .setStyle(2)
                                        .setCustomId('neet2')
                                        .setLabel('secondary')
                                    const buttonSuccess = new ButtonBuilder()
                                        .setStyle(3)
                                        .setCustomId('neet3')
                                        .setLabel('success')
                                    const buttonDanger = new ButtonBuilder()
                                        .setStyle(4)
                                        .setCustomId('neet4')
                                        .setLabel('danger')
                                    const row = new ActionRowBuilder()
                                        .addComponents(buttonPrimary, buttonSecondary, buttonSuccess, buttonDanger)

                                    return message.reply({ embeds: [embed], components: [row] })
                                }

                                if (!buttonsData) {
                                    const newData = new ticket_button_data({
                                        guildId: message.guild.id,
                                        style: styleMapping[style]
                                    });
                                    newData.save();
                                } else if (buttonsData) {
                                    buttonsData.style = styleMapping[style]
                                    buttonsData.save();
                                }
                                args.success("Successfully set the style of the button.")
                            } break;
                            case 'emoji': {
                                const emojiRegex = /<a?:\w+:\d+>/g;
                                const emojis = message.content.match(emojiRegex);
                                await message.guild.emojis.fetch()

                                if (!emojis) return args.error(`Emoji must be static and comes from guild`)
                                emojis.forEach(async (emojiText) => {
                                    const emojiId = emojiText.match(/\d+/)[0];
                                    const emoji = message.guild.emojis.cache.get(emojiId);

                                    if (emoji) {
                                        if (emoji.animated) {
                                            return args.error(`Emoji must be static`);
                                        }

                                        if (!buttonsData) {
                                            const newData = new ticket_button_data({
                                                guildId: message.guild.id,
                                                emoji: emoji.toString()
                                            });
                                            newData.save();
                                        } else if (buttonsData) {
                                            buttonsData.emoji = emoji.toString()
                                            buttonsData.save();
                                        }

                                        args.success(`Emoji found and saved: ${emoji}`);
                                    } else {
                                        return args.error(`Not found this emoji in that guild.`)
                                    }
                                });
                            } break;
                        } break;
                    }
                }
            } else {
                args.usage("ticket");
            }
        } catch (e) {
            console.error(e);
            message.channel.send("An error occurred.");
            sendError(message.guild.id, "ticket", e);
        }
    },
};
