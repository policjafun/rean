const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require('discord.js');
const ascii = require('ascii-table')
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const urlencodedParser = require('body-parser').urlencoded({ extended: false });
const http = require('http');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    ws: {
        properties: {
            browser: "Discord iOS"
        }
    }
});
const fs = require('fs');
require('dotenv').config()
const mongoose = require('mongoose');
const config = require('./config.js');


app.enable("trust proxy"); // if the IP is ::1 it means localhost
app.set("etag", false); // disable cache
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

module.exports.client = client;



let files = fs.readdirSync("./public/backend").filter(ff => ff.endsWith(".js"));
const table = new ascii().setHeading("funkcja", "strona")

files.forEach(f => {

    const file = require(`./public/backend/${f}`);

    if (file && file.name) {

        app.get(file.name, file.run)


        if (file.run2) app.post(file.name, file.run2);


        return console.log(`Dashboard ${file.name}`)
    }
})




client.snipes = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.disabledCommands = [];
client.maintenance = false
client.db = {};
client.config = config;
client.buttons = new Collection();

mongoose.set('strictQuery', true);

mongoose.connect(
    process.env.MONGOOSE
);

module.exports = client;

fs.readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(reason, p);
});
process.on('uncaughtException', (err, origin) => {
    console.error(err, origin);
});




client.login(process.env.TOKEN);

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/frontend/HTML/404.html");
});
let httpServer = http.createServer(app);
httpServer.listen(80, () => {
    console.log(`App on port 80 (HTTP)`);
});
