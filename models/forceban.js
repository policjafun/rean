const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const forceban_user = new Schema({
    user_id: {
        type: String,
        required: true
    },
    guild_id: {
        type: String,
        required: true
    },
    moderator_id: {
        type: String,
    },
 
});

module.exports = mongoose.model(`forceban`, forceban_user);