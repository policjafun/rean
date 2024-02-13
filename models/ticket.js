const mongoose = require("mongoose");

const ticketModel = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: false,
    },
    logsChannelId: {
        type: String,
        required: false,
    },
    modRoleId: {
        type: String,
        required: false,
    },
    settings: {
        oneticketbyuser: {
            type: Boolean,
            default: true,
        }, 
        tickets_name: {
            type: String,
            default: 'ticket_{user_id}',
            required: false,
        }
    }

});

const ticket = mongoose.model("ticket", ticketModel);

module.exports = ticket;
