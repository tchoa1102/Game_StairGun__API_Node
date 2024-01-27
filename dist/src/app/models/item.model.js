"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Schema.ObjectId;
const newObjectId = mongoose_1.default.Types.ObjectId;
const { propertySchema } = require('../schemas');
const ItemModel = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // face, body, foot, weapon
    canWear: { type: Boolean, default: false },
    imgItem: { type: String, required: true },
    texture: { type: String, required: true },
    hasPowerSkill: {
        type: ObjectId,
        ref: 'powerskills',
        default: new newObjectId('000000000000000000000000'),
    },
    description: { type: String, default: '' },
    properties: [propertySchema],
    price: { type: Number, default: 0 },
    isSale: { type: Boolean, default: true },
});
exports.default = mongoose_1.default.model('items', ItemModel);
/**
 * config animation use public
 *
 */
