const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    }
});

const whitelistModel = mongoose.model("aiwhitelist", whitelistSchema);

module.exports = whitelistModel;
