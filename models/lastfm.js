const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const lastFM = new Schema({
    id: String,
    lastfm: String,
    updatedAt: { type: Number, default: Math.floor(Date.now() / 1000) },
});

module.exports = mongoose.model(`lastfm`, lastFM);
