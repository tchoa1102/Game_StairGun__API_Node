"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const playerOnStairGameSchema = new Schema({
    x: { type: String, default: '0' },
    y: { type: String, default: '0' },
    vx: { type: String, default: '0' },
    vy: { type: String, default: '0' },
});
exports.default = playerOnStairGameSchema;
