import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const playerOnMainGameSchema = require('./playerOnMainGame.schema')
const playerOnStairGameSchema = require('./playerOnStairGame.schema')

const playerSchema = new Schema({
    target: {
        type: ObjectId,
        ref: 'users',
    },
    position: { type: Number, required: true },
    mainGame: playerOnMainGameSchema,
    stairGame: playerOnStairGameSchema,
})

export default playerSchema
