class GunRes {
    constructor(bullets, dataPlayers) {
        this.bullets = bullets
        this.players = dataPlayers // Array<{ target: {_id}, damages: Array<number>, HP: number }>
    }
}

module.exports = GunRes
