import { Schema, Types, model } from 'mongoose'
import { IMap } from '../typeModels'
import ObjectModel from './object.model'

const MapModel = new Schema<IMap>({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    objects: [
        {
            location: {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
            },
            data: { type: Types.ObjectId, ref: 'objects', required: true },
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

export default model('maps', MapModel)
