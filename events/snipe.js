const fs = require('fs');
const client = require('../index.js');


client.on('messageDelete', (message) => {
    try {
        const snipeData = {
            content: message.content,
            author: message.author,
            member: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            timestamp: new Date().getTime()
        };
        const channelSnipes = client.snipes.get(message.channel.id) || [];
        channelSnipes.push(snipeData);
        client.snipes.set(message.channel.id, channelSnipes);
    } catch (err) {
        return;
    }
});