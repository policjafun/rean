const mongoose = require("mongoose");

const ticketButtonModel = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    label :{
        type: String,
        default: "open"
    },
    style: { 
        type: String,
        default: "PRIMARY"
    },
    emoji: {
        type: String,
    }
});

const ticket_buttondata = mongoose.model("ticket_buttondata", ticketButtonModel);

module.exports = ticket_buttondata;
