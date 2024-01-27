"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserModel = require('./user.model');
const RoomModel = new Schema({
    type: { type: String, default: 'Tự do' },
    typeMap: {
        type: Schema.ObjectId,
        default: new mongoose_1.default.Types.ObjectId('000000000000000000000000'),
    },
    players: [
        new Schema({
            player: { type: Schema.ObjectId, ref: 'users', required: true },
            position: { type: Number, required: true },
            isOnRoom: { type: Boolean, default: true },
            isRoomMaster: { type: Boolean, default: false },
            isReady: { type: Boolean, default: false },
        }, { timestamps: true }),
    ],
    maxNum: { type: Number, default: 2 },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('rooms', RoomModel);
