"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardDoubleDamage {
    constructor(_this) {
        this._this = _this;
        this.avoidEffect = false;
    }
    addList() {
        const l = this._this.socket.handshake.match.logs.length;
        const curTurn = this._this.socket.handshake.match.logs[l - 1];
        curTurn.push(this);
    }
    effect(data) {
        if (this.avoidEffect)
            return;
        data.damage += data.damage;
    }
}
exports.default = CardDoubleDamage;
