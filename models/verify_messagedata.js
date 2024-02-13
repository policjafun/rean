const mongoose = require("mongoose");
const client = require('../index.js')

const verify_messagedata1 = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        defualt: client.config.color
    },
    thumbnail: {
        type: String
    },
    footerURL: {
        type: String
    },
    footerText: {
        type: String
    },
    authorURL: {
        type: String
    }, 
    authorText: {
        type: String
    },
    imageURL: {
        type: String
    },
    description: {
        type: String
    },
    title: { 
        type: String
    }

});

const verify_messagedata = mongoose.model("verify_messagedata", verify_messagedata1);

module.exports = verify_messagedata;
