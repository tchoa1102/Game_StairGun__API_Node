module.exports = class CollisionCardRes {
    constructor(time, owner, cardOnMatchId, card) {
        this.time = time
        this.owner = owner
        this._id = cardOnMatchId
        this.card = { ...card }
    }
}
