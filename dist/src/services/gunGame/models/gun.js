"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GunState {
    constructor(bullets, dataPlayers) {
        this.bullets = bullets;
        this.players = dataPlayers; // Array<{ target: {_id}, damages: Array<number>, HP: number }>
    }
}
exports.default = GunState;
