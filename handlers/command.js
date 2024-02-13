const chalk = require("chalk-v2");
const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./commands/').forEach((dir) => {
        const files = fs
            .readdirSync(`./commands/${dir}/`)
            .filter((file) => file.endsWith('.js'));
        if (!files || files.length <= 0) {
            console.log(chalk.red(`Commands - 0`));
        } else {
            console.log(chalk.green(`     Commands - ${files.length}`));
        }


        files.forEach((file) => {
            console.log(chalk.magenta(`[+] Loaded ${dir}/${file}`));
        });
        files.forEach((file) => {
            let commandName = file.split('.')[0];
            if (client.commands.get(commandName)) {
                delete require.cache[
                    require.resolve(`../commands/${dir}/${commandName}.js`)
                ];
                client.commands.delete(commandName);
            }
        

            let command = require(`../commands/${dir}/${file}`);

            command.path = file.replace('.js', ''); 
            command.category = dir;

            if (command) {
                client.commands.set(command.name, command);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach((alias) => {
                        client.aliases.set(alias, command.name);
                    });
                }
            }
        });
    });
    console.log(chalk.bold.bgMagenta(`Loaded ${client.commands.size} commands!`));
};
