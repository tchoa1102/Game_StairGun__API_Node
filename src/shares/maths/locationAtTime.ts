export default class LocationAtTime {
    public x: number
    public y: number
    public angle: number
    public time: any
    constructor(playerDataGame: any, time: any) {
        this.x = playerDataGame.bottomLeft.x
        this.y = playerDataGame.bottomLeft.y
        this.angle = playerDataGame.characterGradient
        this.time = time
    }
}
