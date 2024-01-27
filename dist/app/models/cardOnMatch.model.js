"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CardOnMatchModel = new Schema({
    match: { type: Schema.ObjectId, required: true },
    data: { type: Schema.ObjectId, ref: 'cards' },
    x: { type: String, default: '0' },
    y: { type: String, default: '0' },
    isEnable: { type: Boolean, default: true },
    pickUpTime: { type: String, default: new Date().toISOString() },
    owner: { type: Schema.ObjectId, default: null },
});
exports.default = mongoose_1.default.model('cardonmatches', CardOnMatchModel);
