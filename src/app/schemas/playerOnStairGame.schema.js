const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const playerOnStairGameSchema = new Schema({
    x: { type: String, default: '0' },
    y: { type: String, default: '0' },
    vx: { type: String, default: '0' },
    vy: { type: String, default: '0' },
})

module.exports = playerOnStairGameSchema
