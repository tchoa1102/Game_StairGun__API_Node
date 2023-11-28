class GunRes {
    constructor(bullets, dataPlayers) {
        this.bullets = bullets
        this.players = dataPlayers // Array<{ target: {_id}, damages: Array<{damage: number, curHP: number}> }>
    }
}

module.exports = GunRes
