"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MessageModel = new Schema({
    type: { type: String, enum: ['public', 'room', 'private'], required: true }, // room / private / public
    value: { type: String, required: true },
    from: { type: Schema.ObjectId, ref: 'users' },
    to: {
        type: Schema.ObjectId,
        default: new mongoose_1.default.Types.ObjectId('000000000000000000000000'),
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('messages', MessageModel);
/**
 * world public is room specific => world is room
 * 'to', it can be user id or room id
 * to: 000000000000000000000000 => public
 *
 */
