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
const item_schema_1 = require("../schemas/item.schema");
class ItemController {
    // [GET] /api/items/
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield models_1.ItemModel.find({}).lean();
                return res.json({
                    data: items,
                });
            }
            catch (e) {
                return next(e);
            }
        });
    }
    // [POST] /api/items/buy
    buy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('buy');
                const dataUser = req.user;
                const id = dataUser.firebase.identities['google.com'];
                const data = req.body;
                const user = yield models_1.UserModel.findById(id).lean();
                const item = yield models_1.ItemModel.findById(data._id).lean();
                console.log('load data');
                if (user.gold < item.price)
                    return;
                user.gold -= item.price;
                const itemNew = new item_schema_1.Item(item._id);
                user.bag.push(itemNew);
                itemNew.data = item;
                console.log(itemNew);
                const dataRes = {
                    data: {
                        item: itemNew,
                        player: { gold: user.gold },
                    },
                };
                yield models_1.UserModel.updateOne({ _id: user._id }, { gold: user.gold, bag: user.bag });
                return res.json(dataRes);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    // [POST] /api/items/sell
    sellItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataUser = req.user;
                const id = dataUser.firebase.identities['google.com'];
                const data = req.body;
                const user = yield models_1.UserModel.findById(id).populate('bag.data').lean();
                const itemIndex = Array.from(user.bag).findIndex((i) => i._id === data._id);
                if (itemIndex === -1)
                    return res.status(404).json({ message: 'Not Found' });
                const item = user.bag.splice(itemIndex, 1);
                user.gold += item.data.price * 0.7;
                yield models_1.UserModel.updateOne({ _id: user._id }, user);
                return res.json({
                    data: {
                        item,
                        player: {
                            gold: user.gold,
                        },
                    },
                });
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = new ItemController();
