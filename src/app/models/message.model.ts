import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MessageModel = new Schema(
    {
        type: { type: String, enum: ['public', 'room', 'private'], required: true }, // room / private / public
        value: { type: String, required: true },
        from: { type: Schema.ObjectId, ref: 'users' },
        to: {
            type: Schema.ObjectId,
            default: new mongoose.Types.ObjectId('000000000000000000000000'),
        },
    },
    { timestamps: true },
)

export default mongoose.model('messages', MessageModel)
/**
 * world public is room specific => world is room
 * 'to', it can be user id or room id
 * to: 000000000000000000000000 => public
 *
 */
