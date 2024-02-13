const Discord = require('discord.js');
const { exec } = require('child_process')

module.exports = {
    name: 'gitpull',
    aliases: ['update'],
    description: 'Updates bot with the latest version on github',
    userPerms: [],
    botPerms: [],
    usage: ['gitpull'],
    developerOnly: true,
    run: async (client, message, args) => {
        exec("git pull", (error, stdout) => {
            let res = (error || stdout);
            if(error) return args.error(`Something went wrong:\n\n${error}`)
            args.success(`Successfully upgraded bot instance:\n\n\`\`\`${res}\`\`\``)
            return exec("pm2 restart 0", (error, stdout) => {})
        
        })
    },
};
