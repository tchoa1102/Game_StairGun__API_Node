export default class MatchRes {
    public _id: string
    public stairs: any
    public timeStart: any
    public players: any
    public cards: any
    public backgroundStairGame: any
    public stickConfig: any
    public objects: any
    public backgroundGunGame: any
    constructor(matchData: any, stickConfig: any, objects: any, backgroundGunGame: any) {
        this._id = matchData._id
        this.stairs = matchData.stairs
        this.timeStart = matchData.timeStart
        this.players = matchData.players
        this.cards = matchData.cards
        this.backgroundStairGame = matchData.backgroundStairGame
        this.stickConfig = stickConfig
        this.objects = objects
        this.backgroundGunGame = backgroundGunGame
    }
}
