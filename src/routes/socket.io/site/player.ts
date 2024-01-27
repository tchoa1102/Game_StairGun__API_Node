import mongoose from 'mongoose'
import config from '../../../gameConfig.json'
import { UserModel, FriendModel } from '../../../app/models'

class player {
    public socket: any
    public io: any
    public id: any
    public _id: any
    constructor(socket: any, io: any) {
        this.socket = socket
        this.io = io
        this.id = this.socket.handshake.idPlayer
    }

    // on: player/friends/add | emit: player/friends/add/check, res/error
    async addFriend({ targetId }: { targetId: string }) {
        try {
            const findFriend: any = await FriendModel.findOne({
                $and: [
                    { $or: [{ player1: targetId }, { player2: this.socket.handshake.idPlayer }] },
                    { $or: [{ player1: this.socket.handshake.idPlayer }, { player2: targetId }] },
                ],
            }).lean()

            if (findFriend.length > 0)
                return this.socket.emit('res/error', { status: 404, message: 'Các bạn đã là bạn!' })
            const newFriend: any = await UserModel.findById(targetId)
            const findUser: any = await UserModel.findById(this.id).lean()
            if (!newFriend) return this.socket.emit('res/error', { status: 404 })
            // console.log('New friend: ', newFriend)
            this.socket.to(newFriend.socketId).emit('player/friends/add/check', {
                _id: this.id,
                name: findUser.name,
                socketId: this.socket.id,
            })
        } catch (error) {
            console.log(error)
            return this.socket.emit('res/error', { status: 500, message: 'Có lỗi xảy ra!' })
        }
    }

    // on: player/friends/add/res-add | emit: player/friends/add/res-add/success
    async saveFriend({ _id, isAccepted }: { _id: string; isAccepted: boolean }) {
        try {
            const userWantAddFriend: any = await UserModel.findById(_id).lean()
            if (!isAccepted)
                return this.io
                    .to(userWantAddFriend.socketId)
                    .emit('res/error', { status: '300', message: 'Kết bạn thất bại!' })
            const userAddedFriend = await UserModel.findById(this.id).lean()
            if (!userWantAddFriend || !userAddedFriend)
                return this.socket.emit('res/error', { status: 404 })
            const friend = new FriendModel({ player1: _id, player2: this.id })
            // console.log('Id friend', _id, this.id)
            // console.log(friend)
            await friend.save()

            this.io.to(userWantAddFriend.socketId).emit('player/friends/add/res-add/success', {
                _id: this._id,
                socketId: this.socket.id,
                name: userAddedFriend.name,
            })
            this.io.to(this.socket.id).emit('player/friends/add/res-add/success', {
                _id: _id,
                socketId: userWantAddFriend.socketId,
                name: userWantAddFriend.name,
            })
        } catch (error) {
            console.log(error)
            return this.socket.emit('res/error', { status: 500, message: 'Có lỗi xảy ra!' })
        }
    }
}

export default player
