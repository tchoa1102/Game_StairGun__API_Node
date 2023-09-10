const mongoose = require('mongoose')
const { playerSchema, cardOnStairGame } = require('../schemas')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const MapModel = require('./map.model')

const MatchModel = Schema({
    map: { type: ObjectId, ref: 'maps', required: true },
    backgroundStair: {
        type: String,
        default:
            'https://drive.google.com/file/d/11zYw6_rUr4EQqoi4516UTrOelHcdwT_O/view?usp=drive_link',
    },
    curTiled: { type: String, required: true }, // tiled on match
    stairs: [stairSchema],
    timeStart: { type: Number, required: true }, // unit of time: seconds
    timeEnd: { type: Number }, // unit of time: milliseconds
    players: [playerSchema],
    cards: [cardOnStairGame],
})

module.exports = new mongoose.Schema('matches', MatchModel)
