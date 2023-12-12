const mongoose = require('mongoose')
const ObjectModel = require('./object.model')

const MapModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    objects: [
        {
            location: {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
            },
            data: { type: mongoose.Types.ObjectId, ref: 'objects', required: true },
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
})

module.exports = mongoose.model('maps', MapModel)
