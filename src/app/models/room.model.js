const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel = require('./user.model')

const RoomModel = Schema(
    {
        type: { type: String, default: 'Tự do' },
        typeMap: {
            type: Schema.ObjectId,
            default: new mongoose.Types.ObjectId('000000000000000000000000'),
        },
        players: [
            new Schema(
                {
                    player: { type: Schema.ObjectId, ref: 'users', required: true },
                    position: { type: Number, required: true },
                    isOnRoom: { type: Boolean, default: true },
                    isRoomMaster: { type: Boolean, default: false },
                    isReady: { type: Boolean, default: false },
                },
                { timestamps: true },
            ),
        ],
        maxNum: { type: Number, default: 2 },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('rooms', RoomModel)
