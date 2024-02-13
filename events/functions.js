const whitelistSchema = require("../models/whitelist");
const { EmbedBuilder, Collection, PermissionsBitField, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");
const client = require("../index.js");



global.findUser = function (message, user1) {
    let member;
    if (!user1) return member = message.member;
    member =
        message.guild.members.cache.get(user1) ||
        message.guild.members.cache.find((m) =>
            m.user?.username?.toLowerCase().includes(user1.toLowerCase())
        ) ||
        message.guild.members.cache.find((m) =>
            m.nickname?.toLowerCase().includes(user1.toLowerCase())
        ) ||
        message.guild.members.cache.find((m) =>
            m.user?.displayName.toLowerCase().includes(user1.toLowerCase())
        ) ||
        client.users.cache.find((m) =>
            m.user?.globalName.toLowerCase().includes(user1.toLowerCase())
        )

    if (!member) return null;

    return member;
}
function addFooter(embed, currentPage, totalPages) {
    return embed.setFooter({ text: `Page ${currentPage}/${totalPages}` });
}
global.pagination = async function paginator(message, pages, timeout = 120000) {
    const __paginator = require('../models/paginator.js')
    if (!Array.isArray(pages) || pages.length < 1) {
        throw new Error('Invalid pages array');
    }
    let messageDeleted = false;
    const currentPage = { index: 0 };
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('previousButton')
            .setEmoji("<:arrow_left_outline_24px:1172859711209615453>")
            .setStyle(Discord.ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('nextButton')
            .setEmoji("<:arrow_right_outline_24px:1172859611548758076>")
            .setStyle(Discord.ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('closeButton')
            .setEmoji("<:no:1172861072261251112>")
            .setStyle(Discord.ButtonStyle.Danger)
    );

    const messageOptions = {
        components: [row],
    };

    const sentMessage = await message.reply({
        ...messageOptions,
        embeds: [addFooter(pages[currentPage.index], currentPage.index + 1, pages.length)],
    });

    const collector = sentMessage.createMessageComponentCollector({
        time: timeout,
    });

    collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id && !client.config.devs.includes(interaction.user.id)) return interaction.deferUpdate();
        if (messageDeleted) {
            return;
        }
        if (interaction.customId === 'previousButton') {
            currentPage.index = Math.max(0, currentPage.index - 1);
        } else if (interaction.customId === 'nextButton') {
            currentPage.index = Math.min(pages.length - 1, currentPage.index + 1);
        } else if (interaction.customId === 'closeButton') {
            messageDeleted = true;
            sentMessage.delete();
            const emoji = await __paginator.findOne({ userId: interaction.user.id });
            if (emoji) {
                const d = client.emojis.cache.find(guildEmoji => guildEmoji.id === emoji.emoji);
                if (d) {
                    message.react(d);
                    collector.stop();
                } else {
                    message.react('<a:yes:1172878740259360798>');
                    collector.stop();
                }
            } else { 
                message.react('<a:yes:1172878740259360798>');
                collector.stop();
            }
        }
        if (!messageDeleted) {
            await interaction.update({
                ...messageOptions,
                embeds: [addFooter(pages[currentPage.index], currentPage.index + 1, pages.length)],
            });
        }
    });

    collector.on('end', () => {
        if (!messageDeleted) {
            messageOptions.components = [];
            sentMessage.edit(messageOptions);
        }
    });
}

global.sendError = function (serverid, commandname, error) {
    const crashlogschannel = client.guilds.cache.get("1162678576982798366").channels.cache.get("1162812843058528367");

    const embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor('#f73939')
        .setFields([
            {
                name: 'Server ID',
                value: serverid
            },
            {
                name: 'Command Name',
                value: commandname
            },
            {
                name: 'Error',
                value: error,
            }
        ])
    console.log('test1')
    crashlogschannel.send({ content: `<@766271467801018369> <@485414045516562443>`, embeds: [embed] }).then(() => {
        console.log('test')
    })
}


global.getItemsForPage = function getItemsForPage(page, itemsPerPage, items) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
}

client.rasik = {
    def: true,
    skid: true,
    develope: false,
    owner: false,
    yovisek: true,
};
client.chunkStr = (str, size = 1500) => {
    if (typeof str === 'string') {
        const length = str.length;
        const chunks = Array(Math.ceil(length / size));
        if (length) {
            chunks[0] = str.slice(0, length % size || size);
            for (let i = 1, index = chunks[0].length; index < length; i++) {
                chunks[i] = str.slice(index, (index += size));
            }
        }
        return chunks;
    }
};