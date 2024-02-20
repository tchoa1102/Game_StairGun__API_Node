"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CardSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    src: { type: String, required: true },
    match: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('cards', CardSchema);
