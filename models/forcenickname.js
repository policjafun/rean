const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const forcenickname_user = new Schema({
    user_id: {
        type: String,
        required: true
    },
    guild_id: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
 
});

module.exports = mongoose.model(`forcenickname`, forcenickname_user);