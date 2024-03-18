import IResPLayerAfterBattle from '../interfaces/IResPlayerStatusAfterBattle'
import BulletState from './bullet'

export default class GunState {
    bullets: Array<BulletState> = []
    players: Array<IResPLayerAfterBattle> = []
    constructor(bullets?: Array<BulletState>, dataPlayers?: Array<IResPLayerAfterBattle>) {
        if (bullets) this.bullets = bullets
        if (dataPlayers) this.players = dataPlayers || [] // Array<{ target: {_id}, damages: Array<number>, HP: number }>
    }
}
