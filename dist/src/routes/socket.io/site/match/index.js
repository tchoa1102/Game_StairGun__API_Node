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
const models_1 = require("../../../../app/models");
class match {
    constructor() { }
    // on: matches/loaded | emit: matches/players/loaded/res, matches/start/res
    loadedDataObject(socket, io) {
        return ({ idMatch, idRoom }) => __awaiter(this, void 0, void 0, function* () {
            const idPlayer = socket.handshake.idPlayer;
            try {
                console.log('Loaded data object');
                const matchDataRaw = yield models_1.MatchModel.findById(idMatch).lean();
                const playersOnMatch = yield models_1.PlayerOnMatchModel.find({
                    match: matchDataRaw._id,
                }).lean();
                const dataMatch = {
                    numOfLoaded: 1,
                    timeStart: matchDataRaw.timeStart,
                    stairs: matchDataRaw.stairs.map((stair) => (Object.assign({}, stair))),
                    players: playersOnMatch.reduce((result, player) => {
                        result[player.target.toString()] = {};
                        result[player.target.toString()] = Object.assign(Object.assign({}, player), { mainGame: Object.assign({}, player.mainGame), stairGame: Object.assign({}, player.stairGame) });
                        return result;
                    }, {}),
                    // cards: matchDataRaw.cards.map((card) => ({ ...card })),
                };
                const result = yield models_1.PlayerOnMatchModel.updateOne({ target: idPlayer, match: new mongoose_1.default.Types.ObjectId(idMatch) }, { isLoaded: true });
                console.log('idMatch: ', idMatch, '; idRoom: ', idRoom, 'result update: ', result);
                // socket.handshake.match = dataMatch
                const allPlayerLoaded = playersOnMatch.every((player) => {
                    if (player.target.toString() === idPlayer)
                        return true;
                    return player.isLoaded;
                });
                if (allPlayerLoaded) {
                    console.log('action game');
                    setTimeout(([idRoom]) => {
                        io.to(idRoom).emit('matches/start/res');
                    }, 5000, [idRoom]);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new match();
