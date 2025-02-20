"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    points: [{ x: Number, y: Number }],
    src: { type: String, required: true },
    canBeDestroyed: { type: Boolean, required: false },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('objects', ObjectSchema);
