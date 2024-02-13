const { Discord, EmbedBuilder, IntentsBitField } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
    name: "appinfo",
    aliases: ["appinfo", "app"],
    description: "App info",
    userPerms: [],
    botPerms: [],
    usage: ["appinfo <id>"],
    developerOnly: true,
    run: async (client, message, args) => {
        try {
            if (args[0]) {
                const appUrl = `https://discord.com/api/applications/${args[0]}/rpc`;
                const response = await axios.get(appUrl);
                let { id, name, description, icon, terms_of_service_url, privacy_policy_url, bot_public } = response.data;
                let privacy;
                if (privacy_policy_url) {
                    privacy = `[Privacy Policy]())`
                } else {
                    privacy = null;
                }
                let terms;
                if (terms_of_service_url) {
                    terms = `[Terms of Service]())`
                } else {
                    terms = null;
                }
                let odzial;
                if (terms && privacy) {
                    odzial = '〡'
                }
                let publicbot;
                if (bot_public == true) {
                    bot_public = 'yes'
                } else {
                    bot_public = 'no'
                }
                const intents = new IntentsBitField(response.data.flags);
                console.log(intents.serialize())
                const MessageIntent = Object.keys(intents).includes('')

                const icon1 = `https://cdn.discordapp.com/avatars/${id}/${icon}.png?size=1024`
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: name + '〡' + id,
                        iconURL: icon1
                    })
                    .setDescription(`${privacy}${odzial}${terms}\n\n` + description)
                    .setFields(
                        {
                            name: 'app info',
                            value: `guilds: ${guildsCount}\n
                                    public: ${publicbot}\n 
                                    created: ${created}\n`
                        },
                        {
                            name: 'app intents',
                            value: `Members intent: ${MembersIntent}\n
                                    Presence intent: ${PresenceIntent}\n
                                    Message intent: ${MessageIntent}\n`
                        }
                    )

                message.reply({ embeds: [embed] });
            } else {
                args.usage(appinfo);
            }
        } catch (e) {
            console.log(e);
            args.error("An error occurred while executing the command");
        }
    },
};
