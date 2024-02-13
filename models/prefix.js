const mongoose = require(`mongoose`)
const Schema = mongoose.Schema;

const prefixSchema = new Schema({
    guildId: String,
    prefixes: Array
})

module.exports = mongoose.model(`prefix`, prefixSchema)