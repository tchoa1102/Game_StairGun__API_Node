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
const config = require('../../gameConfig.json');
class CardController {
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cards = yield models_1.CardModel.find({}).lean();
            return res.json(cards);
        });
    }
    createListCards(idMatch, stairs) {
        return __awaiter(this, void 0, void 0, function* () {
            // @return Array[]
            const cardsModel = yield models_1.CardModel.find().lean();
            const cards = [];
            const cardsDetail = [];
            const stairsPassed = [];
            // console.log(cards.length, config.maxCard, stairsPassed.length, stairs.length)
            while (cards.length < config.maxCard) {
                // find unique stair
                let i = Math.floor(Math.random() * stairs.length);
                // console.log(i)
                while (stairsPassed.find((j) => j === i) !== undefined) {
                    i = Math.floor(Math.random() * stairs.length);
                }
                stairsPassed.push(i);
                const selectedUniqueStair = stairs[i];
                // find location x on stair
                const x = Math.floor(Math.random() * selectedUniqueStair.width) + selectedUniqueStair.x;
                const cardSelected = cardsModel[Math.floor(Math.random() * cardsModel.length)];
                // result
                const card = new models_1.CardOnMatchModel({
                    x,
                    y: selectedUniqueStair.y,
                    match: idMatch,
                    data: cardSelected._id,
                });
                yield card.save();
                const cardDetail = card.toObject();
                cardDetail.data = cardSelected;
                cards.push(card);
                cardsDetail.push(cardDetail);
            }
            // console.log('Card created: ', cards)
            return { cards, cardsDetail };
        });
    }
}
exports.default = new CardController();
