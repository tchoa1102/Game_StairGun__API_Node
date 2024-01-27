"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../app/models");
class player {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.id = this.socket.handshake.idPlayer;
    }
    // on: player/friends/add | emit: player/friends/add/check, res/error
    addFriend({ targetId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findFriend = yield models_1.FriendModel.findOne({
                    $and: [
                        { $or: [{ player1: targetId }, { player2: this.socket.handshake.idPlayer }] },
                        { $or: [{ player1: this.socket.handshake.idPlayer }, { player2: targetId }] },
                    ],
                }).lean();
                if (findFriend.length > 0)
                    return this.socket.emit('res/error', { status: 404, message: 'Các bạn đã là bạn!' });
                const newFriend = yield models_1.UserModel.findById(targetId);
                const findUser = yield models_1.UserModel.findById(this.id).lean();
                if (!newFriend)
                    return this.socket.emit('res/error', { status: 404 });
                // console.log('New friend: ', newFriend)
                this.socket.to(newFriend.socketId).emit('player/friends/add/check', {
                    _id: this.id,
                    name: findUser.name,
                    socketId: this.socket.id,
                });
            }
            catch (error) {
                console.log(error);
                return this.socket.emit('res/error', { status: 500, message: 'Có lỗi xảy ra!' });
            }
        });
    }
    // on: player/friends/add/res-add | emit: player/friends/add/res-add/success
    saveFriend({ _id, isAccepted }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWantAddFriend = yield models_1.UserModel.findById(_id).lean();
                if (!isAccepted)
                    return this.io
                        .to(userWantAddFriend.socketId)
                        .emit('res/error', { status: '300', message: 'Kết bạn thất bại!' });
                const userAddedFriend = yield models_1.UserModel.findById(this.id).lean();
                if (!userWantAddFriend || !userAddedFriend)
                    return this.socket.emit('res/error', { status: 404 });
                const friend = new models_1.FriendModel({ player1: _id, player2: this.id });
                // console.log('Id friend', _id, this.id)
                // console.log(friend)
                yield friend.save();
                this.io.to(userWantAddFriend.socketId).emit('player/friends/add/res-add/success', {
                    _id: this._id,
                    socketId: this.socket.id,
                    name: userAddedFriend.name,
                });
                this.io.to(this.socket.id).emit('player/friends/add/res-add/success', {
                    _id: _id,
                    socketId: userWantAddFriend.socketId,
                    name: userWantAddFriend.name,
                });
            }
            catch (error) {
                console.log(error);
                return this.socket.emit('res/error', { status: 500, message: 'Có lỗi xảy ra!' });
            }
        });
    }
}
exports.default = player;
