"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectModel = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    points: [{ x: Number, y: Number }],
    src: { type: String, required: true },
    canBeDestroyed: { type: Boolean, required: false },
}, {
    timestamps: true,
});
