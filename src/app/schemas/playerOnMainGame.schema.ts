import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const playerOnMainGameSchema = new Schema({
    x: { type: String, default: '0' }, // why is string? Because store datatype is double
    y: { type: String, default: '0' },
    hp: { type: String, default: '0' },
    sta: { type: Number, default: 0 },
    atk: { type: String, default: '0' },
    def: { type: String, default: '0' },
    luk: { type: String, default: '0' },
    agi: { type: String, default: '0' },
    power_point: { type: Number, default: 0 },
    gunAngel: { type: String, default: '0' },
    gunZone: {
        begin: { type: String, default: '0' },
        end: { type: String, default: '0' },
    },
    stateEffects: [
        {
            data: { type: ObjectId, ref: 'stateeffects' },
            turnReturn: { type: Number, default: 1 },
        },
    ],
})

export default playerOnMainGameSchema
