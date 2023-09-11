const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const CharacterModel = require('./character.model')
const { itemSchema } = require('../schemas')

const UserModel = new Schema({
    idFBase: { type: ObjectId, default: new newObjectId('000000000000000000000000') },
    idSocket: { type: String, default: undefined },
    name: { type: String, default: '' },
    level: { type: Number, default: 1 },
    hp: { type: String, default: '100' }, // health point
    sta: { type: String, default: '100' }, // stamina point
    atk: { type: String, default: '10' }, // attack point
    def: { type: String, default: '5' }, // defense point
    luk: { type: String, default: '5' }, // lucky point
    agi: { type: String, default: '5' }, // agility point

    character: {
        type: ObjectId,
        ref: 'characters',
        default: new newObjectId('000000000000000000000000'),
    },
    skills: [
        {
            type: ObjectId,
            ref: 'Skill',
        },
    ],
    bag: [itemSchema],
})

module.exports = mongoose.model('users', UserModel)
