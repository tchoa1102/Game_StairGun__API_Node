const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
                    player: { type: Schema.ObjectId, required: true },
                    isOnRoom: { type: Boolean, default: true },
                    isRoomMaster: { type: Boolean, default: false },
                    position: { type: Number, required: true },
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
