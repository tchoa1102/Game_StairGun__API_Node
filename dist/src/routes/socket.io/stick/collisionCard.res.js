"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollisionCardRes {
    constructor(time, owner, cardOnMatchId, card) {
        this.time = time;
        this.owner = owner;
        this._id = cardOnMatchId;
        this.card = Object.assign({}, card);
    }
}
exports.default = CollisionCardRes;
