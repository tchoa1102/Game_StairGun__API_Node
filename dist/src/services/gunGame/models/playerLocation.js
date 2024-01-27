"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class playerLocationState {
    constructor(_idPlayer, data, isLive, eventKey) {
        this.data = [];
        this._id = _idPlayer;
        this.data = data;
        this.isLive = isLive;
        this.eventKey = eventKey;
    }
}
exports.default = playerLocationState;
