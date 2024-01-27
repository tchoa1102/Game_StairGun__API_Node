"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const newObjectId = mongoose_1.default.Types.ObjectId;
const playerOnMainGameSchema = require('./playerOnMainGame.schema');
const playerOnStairGameSchema = require('./playerOnStairGame.schema');
const playerSchema = new Schema({
    target: {
        type: ObjectId,
        ref: 'users',
    },
    position: { type: Number, required: true },
    mainGame: playerOnMainGameSchema,
    stairGame: playerOnStairGameSchema,
});
exports.default = playerSchema;
