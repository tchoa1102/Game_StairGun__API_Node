const mongoose = require('mongoose')
const { playerSchema, cardOnStairGame, stairSchema } = require('../schemas')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const MapModel = require('./map.model')

const MatchModel = new Schema({
    map: { type: ObjectId, ref: 'maps', required: true },
    curTiled: { type: String }, // tiled on match
    stairs: [stairSchema],
    timeStart: { type: String, required: true }, // unit of time: seconds
    // cards: [cardOnStairGame],
    backgroundStair: {
        type: String,
        default:
            'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/backgrounds/iopp1dd3m8rsghldcgdh.png',
    },
    timeEnd: { type: Number }, // unit of time: milliseconds
})

module.exports = mongoose.model('matches', MatchModel)
