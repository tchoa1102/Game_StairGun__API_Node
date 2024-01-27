"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameConfig_json_1 = __importDefault(require("../gameConfig.json"));
class Turn {
    constructor(curNumOfTurn, timeOutNextTurn, turner) {
        // id === arrTurn.length
        this.id = curNumOfTurn + 1;
        this.timeOutNextTurn = timeOutNextTurn;
        this.turner = turner;
        this.phase = gameConfig_json_1.default.gunGame.standbyPhase.key;
        this.cards = [];
        this.windForce = Number.parseFloat((Math.random() + 0.5).toFixed(2));
    }
    res() {
        return {
            turner: this.turner,
            windForce: this.windForce,
        };
    }
}
exports.default = Turn;
