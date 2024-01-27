"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomRes {
    constructor({ _id, player }) {
        this._id = _id;
        this.player = {
            _id: player._id,
            isOnRoom: player.isOnRoom,
            isRoomMaster: player.isRoomMaster,
            isReady: player.isReady,
            position: player.position,
        };
    }
}
exports.default = RoomRes;
