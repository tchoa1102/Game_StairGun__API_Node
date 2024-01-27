"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    value: { type: Number, required: true },
    type: { type: String, required: true }, // hp/sta/atk/def/luk/agi
});
exports.default = propertySchema;
