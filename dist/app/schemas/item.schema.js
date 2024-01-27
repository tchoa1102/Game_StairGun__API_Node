"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
const newObjectId = mongoose_1.default.Types.ObjectId;
class Item {
    constructor(data, isWear, levelUp) {
        this.levelUp = 0;
        this._id = new newObjectId();
        this.data = data || new newObjectId('000000000000000000000000');
        this.isWear = isWear || false;
        this.levelUp = levelUp || 0;
    }
}
exports.Item = Item;
const itemSchema = new Schema({
    data: {
        type: ObjectId,
        default: new newObjectId('000000000000000000000000'),
        ref: 'items',
    },
    isWear: {
        type: Boolean,
        default: false,
    },
    levelUp: {
        type: Number,
        default: 0,
    },
});
exports.default = itemSchema;
