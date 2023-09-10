const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const playerOnMainGameSchema = require('./playerOnMainGame.schema')
const playerOnStairGameSchema = require('./playerOnStairGame.schema')

const playerSchema = Schema({
    target: {
        type: ObjectId,
        ref: 'users',
    },
    mainGame: playerOnMainGameSchema,
    stairGame: playerOnStairGameSchema,
})

module.exports = playerSchema
