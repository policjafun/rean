const mongoose = require('mongoose');

const partnerstwaSchema = new mongoose.Schema({
    guildId: { type: String, required: false },
    UserId: { type: String, required: false },
    Amount: { type: Number, required: false, default: 0 }
});

module.exports = mongoose.model('partnershipcount', partnerstwaSchema, 'partnershipcount');
