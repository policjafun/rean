const mongoose = require('mongoose');

const partnerstwaSchema = new mongoose.Schema({
  guildId: { type: String, required: false },
  ChannelId: { type: String, requried: false},
  UserId: { type: String, required: false },
  Amount: { type: String, required: false  }
});

module.exports = mongoose.model('partnerships', partnerstwaSchema, 'partnerships');
