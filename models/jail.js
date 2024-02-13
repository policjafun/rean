const mongoose = require("mongoose");

const xyz = new mongoose.Schema({
    guildId: { 
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    roleId: { 
        type: String,
        required: true
    }


});

const jailmodel = mongoose.model("jail", xyz);

module.exports = jailmodel;
