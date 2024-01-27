import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserModel = require('./user.model')

const RoomModel = new Schema(
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

export default mongoose.model('rooms', RoomModel)
