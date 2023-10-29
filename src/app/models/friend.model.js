const mongoose = require('mongoose')
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

module.exports = mongoose.model('friends', FriendModel)
