"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomAddRes {
    constructor({ _id, type, typeMap, players, maxNum, }) {
        this._id = _id;
        this.type = type;
        this.typeMap = typeMap.toString() === '000000000000000000000000' ? 'Ngẫu nhiên' : 'Tự chọn';
        this.maxNum = maxNum;
        this.chatRoom = [];
        this.players = [];
        players === null || players === void 0 ? void 0 : players.forEach((data) => {
            if (typeof data.player === 'object') {
                this.players.push(Object.assign(Object.assign({}, data), { player: Object.assign({}, data.player) }));
            }
            else {
                this.players.push(Object.assign({}, data));
            }
        });
    }
}
exports.default = RoomAddRes;
