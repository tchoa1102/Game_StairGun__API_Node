import configGame from '../gameConfig.json'
class Turn {
    public id: number
    public timeOutNextTurn: any
    public turner: any
    public phase: string
    public cards: Array<any>
    public windForce: number

    constructor(curNumOfTurn: any, timeOutNextTurn: any, turner: any) {
        // id === arrTurn.length
        this.id = curNumOfTurn + 1
        this.timeOutNextTurn = timeOutNextTurn
        this.turner = turner
        this.phase = configGame.gunGame.standbyPhase.key
        this.cards = []
        this.windForce = Number.parseFloat((Math.random() + 0.5).toFixed(2))
    }

    res() {
        return {
            turner: this.turner,
            windForce: this.windForce,
        }
    }
}

export default Turn
