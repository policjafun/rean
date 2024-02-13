const { EmbedBuilder } = require('discord.js')
const verify_data = require('../../models/verify')
const verify_messagedata = require('../../models/verify_messagedata')
module.exports = {
    name: 'verify',
    aliases: ['verify'],
    description: 'Set a verify',
    category: 'setup',
    usage: [
        "verify role <@role>",
        "verify send <#channel>",
        "verify message <inputInJson>",
        "verify button <label | style | emoji > <input>"
    ],
    developerOnly: true,
    userPerms: ['ManageGuild'],
    clientPerms: ['ManageGuild'],
    run: async (client, message, args) => {
        if (args[0]) {
            switch (args[0].toLowerCase()) {
                case "role": {
                    if (!args[1]) return args.usage('verify');
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                    try {
                        if (role) {
                            const data = await verify_data.findOne({ guildId: message.guild.id })
                            if (data) {
                                data.RoleId = role.id;
                                data.save();
                                args.success('The data was updated successfully')
                            } else {
                                datatosave = new verify_data({
                                    guildId: message.guild.id,
                                    RoleId: role.id
                                })
                                datatosave.save();
                                args.success('The data was saved successfully')
                            }
                        } else {
                            args.error('Not found this role')
                        }
                    } catch (err) {
                        console.error(err)
                        args.error("An error occurred while executing the command");
                    }
                } break;
                case "send": {

                } break;
                case "message": {
                    try {
                        const input = args.slice(1).join(" ");

                        const embed = new EmbedBuilder()

                        const messageData = await verify_messagedata.findOne({ guildId: message.guild.id })

                        if (!args[1] && messageData) {
                            const verifyData = await verify_messagedata.findOne({ guildId: message.guild.id })

                            embed
                                .setTitle(verifyData.title || null)
                                .setDescription(verifyData.description.replace("\n", /\n/g) || null)
                                .setImage(verifyData.imageURL || null)
                                .setAuthor(verifyData.authorText || null, verifyData.authorURL || null)
                                .setFooter(verifyData.footerText || null, verifyData.footerURL || null)
                                .setThumbnail(verifyData.thumbnail || null)
                                .setColor(verifyData.color || client.config.color)

                            message.reply({ embeds: [embed] })
                        } else if (!args[1] && !messageData) {
                            args.error(`You didn't set any message data. Please use \`${client.config.prefix}verify message <inputInJson>\` to set the message data.`)
                        } else if (args[1]) {
                            const parse = JSON.parse(input)
                            console.log(parse)
                            const fields = ["title", "description", "imageURL", "authorText", "authorURL", "footerText", "footerURL", "thumbnail", "color"];
                            let messageData = await verify_messagedata.findOne({ guildId: message.guild.id });
                            if (!messageData) {
                                messageData = new verify_messagedata({
                                    guildId: message.guild.id,
                                });
                            }
                            for (const field of fields) {
                                if (parse[field]) {
                                    if (field === "color") {
                                        const hexColor = parse[field].replace(/[^0-9a-fA-F]/g, '');
                                        if (hexColor.length !== 6) {
                                            args.error("Invalid hex color code. Please provide a valid 6-digit hex color code.");
                                            return;
                                        }
                                        parse[field] = "#" + hexColor;
                                    }
                                    messageData[field] = parse[field];
                                }
                            }
                            await messageData.save();
                            args.success("Successfully set the message data.")
                        }
                    } catch (e) {
                        console.error(e)
                        message.channel.send("An error occured while parsing the input.");
                    }
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
            args.usage('verify')
        }
    }
}