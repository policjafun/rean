const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')

function convertToMs(time) {
    const units = {
        ms: 1,
        s: 1000,
        sec: 1000,
        secs: 1000,
        second: 1000,
        seconds: 1000,
        m: 1000 * 60,
        min: 1000 * 60,
        mins: 1000 * 60,
        minute: 1000 * 60,
        minutes: 1000 * 60,
        h: 1000 * 60 * 60,
        hr: 1000 * 60 * 60,
        hrs: 1000 * 60 * 60,
        hour: 1000 * 60 * 60,
        hours: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
        day: 1000 * 60 * 60 * 24,
        days: 1000 * 60 * 60 * 24
    };

    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1));

    if (isNaN(value) || !units[unit]) {
        return NaN;
    }

    return value * units[unit];
}

module.exports = {
    name: 'mute',
    aliases: ['timeout', 'shutup', 'stfu', 'shut'],
    description: 'Mute a user',
    category: 'mod',
    usage: ['mute <user> [time] [reason]'],
    userPerms: ['ModerateMembers'],
    clientPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            if(!args[0]) return args.usage('mute')
            const arg = args[1] || '1h'
            const time = convertToMs(arg);
            if (isNaN(time)) return args.error(`Invalid time value!`);
            const member = message.mentions.members.first() || findUser(message, args[0])
            
            if (!member) return args.usage('mute')

            const reason = args.slice(1).join(' ') || '*No reason provided*';
            const datenow = new Date()
            if (member.roles.highest.position >= message.member.roles.highest.position) return args.error(`You can't mute this user!`)
            if (member.isCommunicationDisabled() == true) return args.error(`This user is already timeouted!`)
            if (member.id === message.author.id) return args.error(`You can't mute yourself!`)
            if (!member.bannable) return args.error(`I can't mute this user!`)
            if (member.id === client.user.id) return args.error(`You can't mute me!`)

            await member.timeout(time, reason)

            const embed = new EmbedBuilder()
                .setFields([
                    {
                        name: 'Reason',
                        value: reason,
                        inline: true
                    },
                    {
                        name: 'Time',
                        value: `<t:${Math.floor((datenow.getTime() + time) / 1000)}:R>`,
                        inline: true
                    },
                ])
                .setColor(client.config.color)

            message.reply({ embeds: [embed] })
        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
            sendError(message.guild.id, 'mute', e)
        }
    }
}