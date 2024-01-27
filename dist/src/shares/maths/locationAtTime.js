"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LocationAtTime {
    constructor(playerDataGame, time) {
        this.x = playerDataGame.bottomLeft.x;
        this.y = playerDataGame.bottomLeft.y;
        this.angle = playerDataGame.characterGradient;
        this.time = time;
    }
}
exports.default = LocationAtTime;
