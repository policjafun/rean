const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    guildId: String,
    enabledEvents: Array,
    channelId: String,
    turn: {
        default: false,
        type: Boolean,
    },
});

const logsModel = mongoose.model("logsmodel", logSchema);

module.exports = logsModel;
