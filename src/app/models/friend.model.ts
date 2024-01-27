import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserModel = require('./user.model')

const FriendModel = new Schema(
    {
        player1: { type: Schema.ObjectId, ref: 'users' },
        player2: { type: Schema.ObjectId, ref: 'users' },
    },
    {
        timestamps: true,
    },
)

export default mongoose.model('friends', FriendModel)
