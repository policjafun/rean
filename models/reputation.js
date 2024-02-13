const mongoose = require("mongoose");

const reputation_schema = new mongoose.Schema({
    userId: { type: String, required: true },
    reputation_count: { type: Number, default: 0 },
    lastGiven: { type: Date, default: new Date() },
});

const reputation = mongoose.model("reputation", reputation_schema);

module.exports = reputation;
