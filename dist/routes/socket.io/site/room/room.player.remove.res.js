"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomPlayerRemoveRes {
    constructor({ player, position, newMaster, }) {
        this._id = player;
        this.position = position;
        this.newMaster = newMaster;
    }
}
exports.default = RoomPlayerRemoveRes;
