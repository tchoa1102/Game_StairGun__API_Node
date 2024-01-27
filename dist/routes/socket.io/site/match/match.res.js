"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatchRes {
    constructor(matchData, stickConfig, objects, backgroundGunGame) {
        this._id = matchData._id;
        this.stairs = matchData.stairs;
        this.timeStart = matchData.timeStart;
        this.players = matchData.players;
        this.cards = matchData.cards;
        this.backgroundStairGame = matchData.backgroundStairGame;
        this.stickConfig = stickConfig;
        this.objects = objects;
        this.backgroundGunGame = backgroundGunGame;
    }
}
exports.default = MatchRes;
