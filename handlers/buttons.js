const fs = require("fs");
const chalk = require("chalk-v2");

module.exports = (client) => {
    fs.readdirSync("./buttons/")
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
            const button = require(`../buttons/${file}`);
            client.buttons.set(button.id, button);
        });
    console.log(chalk.blue("Loaded all buttons successfully"));
};