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
const models_1 = require("../../../../app/models");
class Item {
    constructor(socket, io) {
        this._id = socket.handshake.idPlayer;
        this.socket = socket;
        this.io = io;
    }
    // on | emit: | return Array[item]
    wearOrUnbindEquip({ _id, type }, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('hello: ', _id, type);
                const resArray = [];
                const statusUpdate = {};
                const user = yield models_1.UserModel.findById(this._id).populate('bag.data').lean();
                const itemWasWorn = user.bag.find((item) => item.isWear && item.data.type === type);
                const itemIsGoingWear = user.bag.find((item) => !item.isWear && item._id.toString() === _id);
                console.log('itemWasWorn: ', itemWasWorn, 'itemIsGoingWear: ', itemIsGoingWear);
                if (itemWasWorn) {
                    const typeWear = itemWasWorn.data.type;
                    itemWasWorn.isWear = false;
                    itemWasWorn.data.properties.forEach((property) => {
                        const newValue = JSON.parse(user[property.type]) - property.value;
                        user[property.type] = JSON.stringify(newValue);
                        statusUpdate[property.type] = user[property.type];
                    });
                    user.looks[typeWear] = '';
                    resArray.push(itemWasWorn);
                    // console.log(itemWasWorn)
                }
                if (itemIsGoingWear) {
                    const typeWear = itemIsGoingWear.data.type;
                    itemIsGoingWear.isWear = true;
                    itemIsGoingWear.data.properties.forEach((property) => {
                        const newValue = JSON.parse(user[property.type]) + property.value;
                        user[property.type] = JSON.stringify(newValue);
                        statusUpdate[property.type] = user[property.type];
                    });
                    user.looks[typeWear] = itemIsGoingWear.data.texture;
                    resArray.push(itemIsGoingWear);
                    // console.log(itemWasWorn)
                }
                yield models_1.UserModel.updateOne({ _id: user._id }, user);
                return callback({
                    status: statusUpdate,
                    looks: user.looks,
                    itemsBag: resArray,
                });
            }
            catch (e) {
                console.log(e);
                return;
            }
        });
    }
}
exports.default = Item;
