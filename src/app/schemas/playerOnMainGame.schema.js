const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const playerOnMainGameSchema = new Schema({
    x: { type: String, default: '0' }, // why is string? Because store datatype is double
    y: { type: String, default: '0' },
    hp: { type: String, default: '0' },
    sta: { type: Number, default: 0 },
    power_point: { type: Number, default: 0 },
    stateEffects: [
        {
            data: { type: ObjectId, ref: 'stateeffects' },
            turnReturn: { type: Number, default: 1 },
        },
    ],
})

module.exports = playerOnMainGameSchema
