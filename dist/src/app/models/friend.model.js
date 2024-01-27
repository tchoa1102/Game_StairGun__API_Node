"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserModel = require('./user.model');
const FriendModel = new Schema({
    player1: { type: Schema.ObjectId, ref: 'users' },
    player2: { type: Schema.ObjectId, ref: 'users' },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('friends', FriendModel);
