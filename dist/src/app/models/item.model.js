"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemas_1 = require("../schemas");
const ObjectId = mongoose_1.Schema.ObjectId;
const newObjectId = mongoose_1.Types.ObjectId;
const ItemSchema = new mongoose_1.Schema({
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
    properties: [schemas_1.propertySchema],
    price: { type: Number, default: 0 },
    isSale: { type: Boolean, default: true },
});
exports.default = (0, mongoose_1.model)('items', ItemSchema);
/**
 * config animation use public
 *
 */
