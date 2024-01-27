"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const stairSchema = new Schema({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 20 },
    img: {
        type: String,
        default: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    },
});
exports.default = stairSchema;
