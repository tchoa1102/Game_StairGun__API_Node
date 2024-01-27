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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../app/models");
function createTypeMessage(typeMessage, id) {
    return typeMessage[id] || 'private';
}
class Chat {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this._id = this.socket.handshake.idPlayer;
        this.name = this.socket.handshake.namePlayer;
        console.log('socket: ', this.socket.handshake.idPlayer);
        this.typeMessage = {
            '': 'public',
        };
    }
    // on: chat/send | emit: chat/receiving
    sendMessage({ receiverId, message }, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            // receiverId = '' | [id]
            if (!message || message.trim().length === 0)
                return;
            try {
                // type: public | room | private
                const idRoom = this.socket.handshake.idRoom;
                this.typeMessage[idRoom] = 'room';
                const type = createTypeMessage(this.typeMessage, receiverId);
                const value = message.trim();
                const from = new mongoose_1.default.Types.ObjectId(this._id);
                const objMessage = { type, value, from };
                let receiverSocketId = '';
                // to room
                if (type === this.typeMessage[idRoom]) {
                    objMessage.to = idRoom;
                    receiverSocketId = idRoom;
                }
                // to player
                if (type !== this.typeMessage[idRoom] && type !== this.typeMessage['']) {
                    objMessage.to = receiverId;
                    const targetPlayer = yield models_1.UserModel.findById(receiverId).lean();
                    console.log(targetPlayer.socketId);
                    receiverSocketId = targetPlayer.socketId;
                }
                // default: to public
                const newMessage = new models_1.MessageModel(objMessage);
                // await newMessage.save()
                const resMessage = {
                    sender: { _id: this._id, name: this.name },
                    receiver: { _id: receiverId },
                    message: newMessage.value,
                };
                console.log('receivedId: ', receiverId, ', Type: ', type, objMessage);
                if (type !== this.typeMessage[idRoom] && type !== this.typeMessage['']) {
                    // if send to player
                    console.log('send to player, receiverSocketId: ', receiverSocketId);
                    this.socket.emit('chat/receiving', resMessage);
                }
                // send to public
                if (type === this.typeMessage[''])
                    return this.io.emit('chat/receiving', resMessage);
                // send to room | receiver
                console.log('send other player');
                return this.io.to(receiverSocketId).emit('chat/receiving', resMessage);
            }
            catch (error) {
                console.log(error);
                callback({
                    status: 500,
                });
            }
        });
    }
}
exports.default = Chat;
