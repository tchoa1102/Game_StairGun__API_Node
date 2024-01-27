export default class CardDoubleDamage {
    private _this: any
    public avoidEffect: boolean
    constructor(_this: any) {
        this._this = _this
        this.avoidEffect = false
    }

    addList() {
        const l = this._this.socket.handshake.match.logs.length
        const curTurn = this._this.socket.handshake.match.logs[l - 1]
        curTurn.push(this)
    }

    effect(data: any) {
        if (this.avoidEffect) return
        data.damage += data.damage
    }
}
