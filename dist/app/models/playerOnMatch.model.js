"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const playerOnMainGameSchema = require('../schemas/playerOnMainGame.schema');
const playerOnStairGameSchema = require('../schemas/playerOnStairGame.schema');
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
});
exports.default = mongoose_1.default.model('playeronmatches', PlayerOnMatchModel);
