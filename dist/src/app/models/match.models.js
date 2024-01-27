"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { playerSchema, cardOnStairGame, stairSchema } = require('../schemas');
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const newObjectId = mongoose_1.default.Types.ObjectId;
const MapModel = require('./map.model');
const MatchModel = new Schema({
    map: { type: ObjectId, ref: 'maps', required: true },
    curTiled: { type: String }, // tiled on match
    stairs: [stairSchema],
    timeStart: { type: String, required: true }, // unit of time: seconds
    // cards: [cardOnStairGame],
    backgroundStair: {
        type: String,
        default: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/backgrounds/iopp1dd3m8rsghldcgdh.png',
    },
    timeEnd: { type: Number }, // unit of time: milliseconds
});
exports.default = mongoose_1.default.model('matches', MatchModel);
