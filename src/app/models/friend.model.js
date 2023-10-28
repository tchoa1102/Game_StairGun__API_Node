const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FriendModel = new Schema({
    
}, {
    timestamps: true
})

module.exports = mongoose.model('friends', FriendModel)
