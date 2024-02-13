const mongoose = require("mongoose");

const joinrole = new mongoose.Schema({
    guildId: { 
        type: String, 
        required: true 
    },
    roleId: { 
        type: Array, 
        required: true
    },
});

const joinrole_schema = mongoose.model("joinrole_schema", joinrole);

module.exports = joinrole_schema;
