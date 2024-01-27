"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectModel = require('./object.model');
const MapModel = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    objects: [
        {
            location: {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
            },
            data: { type: mongoose_1.default.Types.ObjectId, ref: 'objects', required: true },
        },
    ],
    playersLocations: [
        {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
    ],
    backgroundGunGame: {
        type: String,
        default: 'C:UsersadminOneDriveWorkspacePhaserGame_StairGun__Client_Phasersrcservicessocket',
    },
});
exports.default = mongoose_1.default.model('maps', MapModel);
