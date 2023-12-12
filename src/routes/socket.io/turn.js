const configGame = require('../../gameConfig.json')
class Turn {
    constructor(curNumOfTurn, timeOutNextTurn, turner) {
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

module.exports = Turn
