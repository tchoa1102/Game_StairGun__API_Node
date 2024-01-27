"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const newObjectId = mongoose_1.default.Types.ObjectId;
const CharacterModel = require('./character.model');
const { itemSchema } = require('../schemas');
const UserModel = new Schema({
    uid: { type: String, default: null }, //idFBase
    socketId: { type: String, default: null },
    clientId: { type: String, default: null },
    name: { type: String, default: null },
    email: { type: String, default: null },
    picture: { type: String, default: null },
    level: { type: Number, default: 1 },
    HP: { type: Number, default: 100 }, // health point
    STA: { type: Number, default: 100 }, // stamina point
    ATK: { type: Number, default: 10 }, // attack point
    DEF: { type: Number, default: 5 }, // defense point
    LUK: { type: Number, default: 5 }, // lucky point
    AGI: { type: Number, default: 5 }, // agility point
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
            default: '',
        },
        body: {
            type: String,
            default: '',
        },
        foot: {
            type: String,
            default: '',
        },
        weapon: { type: String, default: '' },
    },
    bag: [itemSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model('users', UserModel);
