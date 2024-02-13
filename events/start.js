const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk-v2');

client.on('ready', () => {
    
    client.user.setActivity({
        name: `nawijam i smaże lemon silver haze`,
        type: ActivityType.Custom
    });

    console.log(chalk.red(`Logged in as ${client.user.tag}!`));

    client.application.commands.set([])
});
