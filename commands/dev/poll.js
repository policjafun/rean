const { find } = require('node-emoji');
const polls = require("../../models/pollModel.js");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'poll',
    aliases: [],
    description: 'Zarządza ankietami na serwerze.',
    category: 'Ankiety',
    usage: ['create', 'end'],
    userPerms: [],
    clientPerms: [],
    developerOnly: true,
    run: async (client, message, args) => {
        let _emoji = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
        let emojis = [];

        let option = args[0];
        let channel = message.mentions.channels.first();
        let question = args[1];
        let rawOptions = args[2];
        let cEmojis = args[3] || "";
        let id = args[4];
        let poll = await polls.findOne({ message: id });

        if (option === "create") {
            rawOptions = rawOptions.split("|");
            cEmojis = cEmojis?.trim()?.replace(/ +/g, "")?.split("|");
            if (rawOptions.length < 2 || rawOptions.length > 25) {
                return message.channel.send("\`[ ❌ ]\` Musisz wprowadzić minimum 2 opcje lub nie może być ich więcej niż 5!");
            }

            const rows = [new ActionRowBuilder()];

            for (let i = 0; i < rawOptions.length; i++) {
                let ind = Math.floor(i / 5);

                emojis.push(fixEmoji(client, cEmojis[i]) || _emoji[i]);

                const button = new ButtonBuilder({
                    customId: emojis[i],
                    emoji: emojis[i],
                    label: "0",
                    style: ButtonStyle.Success
                });
                rows[ind] ? rows[ind].addComponents(button) : rows[ind] = new ActionRowBuilder({
                    components: [button]
                });
            }

            message.channel.send({
                embeds: [{
                    color: client.mainColor,
                    title: question.slice(0, 256),
                    description: rawOptions.map((v, i) => `${cEmojis[i] || emojis[i]} ${v}`).join("\n"),
                }], components: rows
            }).then(async (v) => {
                await polls.create({
                    question,
                    message: v.id,
                    channel: channel.id,
                    guild: message.guild.id,
                    votes: {},
                    voters: [],
                    emojis,
                });
                message.channel.send("\`[ ✔️ ]\` Rozpoczęto ankietę na kanale <#" + channel.id + ">!");
            }).catch((e) => {
                console.log(e);
            });
        }

        if (option === "end") {
            if (!poll) return message.channel.send("\`[ ❌ ]\` Nie odnaleziono żadnej ankiety powiązanej z tym ID!");

            if (poll.ended) return message.channel.send("\`[ ❌ ]\` Wprowadzona ankieta jest zakończona!");

            const msg = await message.guild.channels.cache.get(poll.channel).messages.fetch(id);

            if (!msg) return message.channel.send("\`[ ❌ ]\` Nie udało się zakończyć ankiety, ponieważ wiadomość została usunięta.");

            const opt = msg.embeds[0].description?.split("\n");

            if (!opt) return message.channel.send("`[ ❌ ]` Nie udało się zakończyć ankiety, ponieważ nie ma żadnych wygranych opcji.");

            const x = poll.votes ? Object.entries(poll.votes).sort((a, b) => b[1] - a[1]) : [];
            let winner = opt.filter(v => v.includes(x[0][0]));

            await message.channel.send("\`[ ✔️ ]\` Pomyślnie zakończono ankietę!");
            msg.edit({
                components: [], embeds: [{
                    color: client.mainColor,
                    title: msg.embeds[0].title,
                    description: `Ta ankieta została zakończona! Najczęściej wybieraną opcją jest ${winner} która posiada **${x[0][1]}** głosów!`,
                }]
            });

            await polls.findOneAndUpdate({ message: id }, { ended: true });
        }
    }
};

function fixEmoji(client, emj = "") {
    const e = find(emj)?.emoji, e2 = client.emojis.cache.find(v => v.toString() === emj);

    return e2?.id || e;
}
