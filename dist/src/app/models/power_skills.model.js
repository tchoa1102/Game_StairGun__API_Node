"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PowerSkillModel = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    srcConfig: { type: String, required: true },
});
exports.default = mongoose_1.default.model('powerskills', PowerSkillModel);
