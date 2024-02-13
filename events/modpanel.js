const client = require("../index.js");
const Discord = require("discord.js");
const x = Discord;
const y = client;

// lkokokokok spaghetti code @doniczka xddx


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


y.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        switch (interaction.values[0]) {
            case 'modpanel_t/o': {
    
            } break
            case 'modpanel_kick': {
                
            } break
            case 'modpanel_ban': {

            } break
            case 'modpanel_jail': {

            } break

        }
        }

});