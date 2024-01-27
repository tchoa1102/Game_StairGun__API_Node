export default class GunState {
    bullets: any
    players: any
    constructor(bullets: any, dataPlayers: any) {
        this.bullets = bullets
        this.players = dataPlayers // Array<{ target: {_id}, damages: Array<number>, HP: number }>
    }
}
