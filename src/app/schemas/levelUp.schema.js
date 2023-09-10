const mongoose = require('mongoose')
const Schema = mongoose.Schema

const levelUpSchema = Schema({
    type: Number,
    default: 0,
})

module.exports = levelUpSchema
