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
const models_1 = require("../models");
class AuthController {
    // [GET] /api/auth/load
    load(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading user...');
            const dataUser = req.user;
            const id = dataUser.firebase.identities['google.com'];
            const user = yield models_1.UserModel.findById(id).populate('bag.data').lean();
            const friends = yield models_1.FriendModel.find({
                $or: [{ player1: id }, { player2: id }],
            })
                .populate('player1')
                .populate('player2')
                .lean();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const friendEdited = friends.map((friend) => {
                if (friend.player1._id.toString() === user._id.toString()) {
                    return configData(friend.player2);
                }
                else if (friend.player2._id.toString() === user._id.toString()) {
                    return configData(friend.player1);
                }
                function configData(oldData) {
                    return {
                        _id: oldData._id,
                        name: oldData.name,
                        picture: oldData.picture,
                        level: oldData.lever,
                        socketId: oldData.socketId,
                    };
                }
            });
            user.friends = friendEdited;
            // console.log('player loaded: ', user)
            return res.json(user);
        });
    }
}
exports.default = new AuthController();
