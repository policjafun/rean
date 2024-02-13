const client = require('../../index.js').client;

module.exports = {
  name: '/',
  run: async (req, res) => {
    console.log()
    delete require.cache[require.resolve("../frontend/HTML/index.ejs")];
    let status = {
      online: 'online',
      idle: 'afk',
      dnd: 'dnd',
      offline: 'offline'
    };

    const Doniczkamember = client.guilds.cache.get("1160561390520631329").members.cache.get("485414045516562443")
    const AruuviMember = client.guilds.cache.get("1160561390520631329").members.cache.get("766271467801018369")
    let args = { 
      guilds: client.guilds.cache.size,
      users: client.users.cache.size,
      commands: client.commands.size,
      status: status,
      doniczkaMember: Doniczkamember,
      AruuviMember: AruuviMember,
    }

    res.render("./public/frontend/HTML/index.ejs", args);
  }
};
