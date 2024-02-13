const chalk = require("chalk-v2");
const fs = require(`node:fs`);

module.exports = async (client) => {
    let models = fs.readdirSync(`${process.cwd()}/models`, (err) => {
        if (err) throw new Error(err);
    });
    for (let modelName of models) {
        let model = require(`${process.cwd()}/models/${modelName}`);
        client.db[modelName.replace(`.js`, ``)] = model;
    }
    

    console.log(chalk.greenBright("Loaded all models!"))
};
