const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const CharacterModel = require('./character.model')
const { itemSchema } = require('../schemas')

const UserModel = new Schema(
    {
        uid: { type: String, default: null }, //idFBase
        socketId: { type: String, default: null },
        clientId: { type: String, default: null },
        name: { type: String, default: null },
        email: { type: String, default: null },
        picture: { type: String, default: null },
        level: { type: Number, default: 1 },
        HP: { type: String, default: '100' }, // health point
        STA: { type: String, default: '100' }, // stamina point
        ATK: { type: String, default: '10' }, // attack point
        DEF: { type: String, default: '5' }, // defense point
        LUK: { type: String, default: '5' }, // lucky point
        AGI: { type: String, default: '5' }, // agility point

        gold: { type: Number, default: 0 },

        character: {
            type: ObjectId,
            ref: 'characters',
            default: new newObjectId('65015266187107a35aa5c222'),
        },
        skills: [
            {
                type: ObjectId,
                ref: 'Skill',
            },
        ],
        looks: {
            face: {
                type: String,
                default:
                    '',
            },
            body: {
                type: String,
                default:
                    '',
            },
            hand: {
                type: String,
                default:
                    '',
            },
            foot: {
                type: String,
                default:
                    '',
            },
        },
        bag: [itemSchema],
    },
    { timestamps: true },
)

module.exports = mongoose.model('users', UserModel)
