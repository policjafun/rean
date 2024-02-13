const client = require('../../index.js').client;

module.exports = {
    name: '/api',
    run: async (req, res) => {
        let args = {
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            commands: client.commands.size,
        }

        res.send({args});
    }
};
