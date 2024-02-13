const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    isFlag: {
        type: Boolean,
        default: false,
        required: true,
    },
});

const whitelistModel = mongoose.model("whitelistModel", whitelistSchema);

module.exports = whitelistModel;
