const fs = require("fs");
const chalk = require("chalk-v2");

module.exports = (client) => {
    fs.readdirSync("./events/")
        .filter((file) => file.endsWith(".js"))
        .forEach((event) => {
            require(`../events/${event}`);
        });
    console.log(chalk.yellowBright("Loaded all events!"));
};