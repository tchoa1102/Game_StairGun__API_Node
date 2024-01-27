import mongoose from 'mongoose'
const Schema = mongoose.Schema

const playerOnMainGameSchema = require('../schemas/playerOnMainGame.schema')
const playerOnStairGameSchema = require('../schemas/playerOnStairGame.schema')

const PlayerOnMatchModel = new Schema({
    match: { type: Schema.ObjectId, required: true },
    target: {
        type: Schema.ObjectId,
        ref: 'users',
    },
    isLoaded: { type: Boolean, default: false },
    position: { type: Number, required: true },
    mainGame: playerOnMainGameSchema,
    stairGame: playerOnStairGameSchema,
})

export default mongoose.model('playeronmatches', PlayerOnMatchModel)
