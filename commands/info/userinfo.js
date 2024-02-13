const { EmbedBuilder, UserFlags } = require('discord.js');
const badges_schema = require('../../models/badges.js');


const flagsEmojis = {
    ActiveDeveloper: "<:7011activedeveloperbadge:1171790171390357595>",
    BugHunterLevel1: "<:discordbughunter:1171790155745591356>",
    BugHunterLevel2: "<:discordgoldbughunter:1171790179078508574>",
    CertifiedModerator: "<:certifiedmoderator:1171790159960879135>",
    HypeSquadOnlineHouse1: "<:hypesquadbravery:1171790632017199245>",
    HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1171790566686720030>",
    HypeSquadOnlineHouse3: "<:hypesquadbalance:1171790535325925436>",
    PremiumEarlySupporter: "<:earlysupporter:1171790165509947393>",
    Partner: "<:partneredserverowner:1171790167879733339>",
    Staff: "<:1discordstaff:1171790176197025862>",
    Nitro: "<:subscribernitro:1171790162687184966>",
    VerifiedBot: "",
    VerifiedDeveloper: "<:earlyverifiedbotdeveloper:1171790371152461834>",
    knownas: "<:knownas:1171792749633216584>",
}
const statusEmojis = {
    desktop: {
        online: "<:onlinedesktop:1171794759283638294>",
        idle: "<:idledesktop:1171794757463322654>",
        dnd: "<:dnddesktop:1171794754686701579>",
        offline: "<:offlinedesktop:1171794756133728358>"
    },
    mobile: {
        online: "<:onlinemobile:1171794750303653961>",
        idle: "<:idlemobile:1171794748529459230>",
        dnd: "<:dndmobile:1171794843115192430>",
        offline: "<:offlinemobile:1171794767164739604>"
    },
    web: {
        online: "<:onlineweb:1171794751742292059>",
        idle: "<:idleweb:1171794764996292752>",
        dnd: "<:dndweb:1171794753076080741>",
        offline: "<:offlineweb:1171794760416104463>"
    }
};

module.exports = {
    name: 'userinfo',
    aliases: ['user', 'ui', 'uinfo'],
    description: 'Get info about the user!',
    category: 'info',
    usage: ['userinfo'],
    cooldown: 3,
    run: async (client, message, args) => {
        try {
            let user;
            let member;
            try {
                if (args[0]) {
                    user =
                        message.mentions.users.first() ||
                        client.users.cache.find((u) =>
                            u.username.toLowerCase().includes(args[0].toLowerCase())
                        ) ||
                        (await client.users.fetch(args[0]));
                    member = message.guild.members.cache.get(user.id);
                } else {
                    user = message.author;
                    member = message.member;
                }
            } catch (err) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setDescription(
                        `I can't find that user!`
                    );

                return message.reply({
                    embeds: [embed],
                });
            }
            const currentDate = new Date();
            const createdDateDiff = currentDate - user.createdAt;

            const createdYears = createdDateDiff / (1000 * 60 * 60 * 24 * 365);
            const createdMonths = createdDateDiff / (1000 * 60 * 60 * 24 * 30);
            const createdDays = createdDateDiff / (1000 * 60 * 60 * 24);
            const createdHours = createdDateDiff / (1000 * 60 * 60);

            let createdText = '';
            if (createdYears >= 1) {
                createdText = `**${Math.floor(createdYears)} years**`;
            } else if (createdMonths >= 1) {
                createdText = `**${Math.floor(createdMonths)} months**`;
            } else if (createdDays >= 1) {
                createdText = `**${Math.floor(createdDays)} days**`;
            } else {
                createdText = `**${Math.floor(createdHours)} hours**`;
            }

            let infoText = '';

            if (member) {
                const joinedDateDiff = currentDate - member.joinedAt;
                const joinedYears = joinedDateDiff / (1000 * 60 * 60 * 24 * 365);
                const joinedMonths = joinedDateDiff / (1000 * 60 * 60 * 24 * 30);
                const joinedDays = joinedDateDiff / (1000 * 60 * 60 * 24);
                const joinedHours = joinedDateDiff / (1000 * 60 * 60);
                if (joinedYears >= 1) {
                    infoText = `Joined guild: **${Math.floor(joinedYears)} years ago**\nCreated account: ${createdText} **ago**.`;
                } else if (joinedMonths >= 1) {
                    infoText = `Joined guild: **${Math.floor(joinedMonths)} months ago**\nCreated account: ${createdText} **ago**.`;
                } else if (joinedDays >= 1) {
                    infoText = `Joined guild: **${Math.floor(joinedDays)} days ago**\nCreated account: ${createdText} **ago**.`;
                } else {
                    infoText = `Joined guild: **${Math.floor(joinedHours)} hours ago**\nCreated account: ${createdText} **ago**.`;
                }
            } else {
                infoText = `Created account: ${createdText} **ago**.`;
            }

            const userFlags = user.flags ? user.flags.toArray() : [];

            const flags = userFlags.map(flag => flagsEmojis[flag]);

            if (!user.discriminator || user.discriminator === '0') {
                flags.push(flagsEmojis.knownas);
            }

            if (user.avatar && user.avatar.startsWith('a_')) {
                flags.push(flagsEmojis.Nitro);
            }
          
            const clientStatus = member?.presence?.clientStatus;
            let clientStatusText = "Not available";

            if (clientStatus) {
                clientStatusText = "";
                for (const device in clientStatus) {
                    const status = clientStatus[device];
                    clientStatusText += `${statusEmojis[device][status]}  `;
                }
            }
            
            const mutualGuilds = client.guilds.cache.filter(guild => guild.members.cache.has(user.id)).size;
            const exampleEmbed = new EmbedBuilder()
                .setColor(client.config.color)
                .setAuthor({ name: `${user.username} 〡 ${user.id}`, iconURL: `${user.displayAvatarURL()}` })
                .addFields(
                    {
                        name: 'dates',
                        value: `${infoText}`,
                        inline: false
                    },
                    {
                        name: 'global',
                        inline: false,
                        value: `bot: ${user.bot ? 'yes' : 'no'}\nbadges: ${userFlags.length ? flags.join(' ') : 'None'}\nstatus: ${clientStatusText}`,

                    }
                )
                .setFooter({ text: `${mutualGuilds} mutual guilds ` });
            message.reply({ embeds: [exampleEmbed] });
        } catch (e) {
            console.error(e);
            message.channel.send('An error occurred while executing the command.');
        }
    }
}
