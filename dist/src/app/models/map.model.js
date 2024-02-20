"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MapModel = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    objects: [
        {
            location: {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
            },
            data: { type: mongoose_1.Types.ObjectId, ref: 'objects', required: true },
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
exports.default = (0, mongoose_1.model)('maps', MapModel);
