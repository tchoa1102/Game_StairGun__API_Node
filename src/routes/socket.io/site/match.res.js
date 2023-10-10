class MatchRes {
    constructor(matchData, stickConfig, tiledMapConfig) {
        this._id = matchData._id
        this.stairs = matchData.stairs
        this.timeStart = matchData.timeStart
        this.players = matchData.players
        this.cards = matchData.cards
        this.backgroundStairGame = matchData.backgroundStairGame
        this.stickConfig = stickConfig
        this.tiledMapConfig = tiledMapConfig
    }
}

module.exports = MatchRes
