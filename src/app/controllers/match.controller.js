const config = require('../../gameConfig.json')

const { stairSchema } = require('../schemas')

class MatchController {
    // [GET] /api/matches/:match
    async get(req, res, next) {
        return res.json({ message: 'Hello matches' })
    }

    // [POST] /api/matches
    async create(req, res, next) {
        const match = req.match
        // const listPlayer_1 = req.listPlayer1
        // const listPlayer_2 = req.listPlayer2

        const listStair = createStairs()
        const configCircleStick = require('../../config/game/circleStickAtlas.json')

        return res.json({
            message: '',
            data: {
                stairs: listStair,
                stickConfig: configCircleStick,
            },
        })
    }
}

function createStairs() {
    // @return Array[]
    const stairs = []
    for (let i = 0; i < config.maxStair; i++) {
        let x = 0
        do {
            x = Math.random() * (config.maxWidthStairGame - 100)
        } while (stairs.find((stair) => stair.x === x) !== undefined)
        let y = 0
        do {
            y = Math.random() * (config.maxHeightStairGame - 200) + 100
        } while (stairs.find((stair) => stair.y === y) !== undefined)
        let width = Math.random() * (config.stair.maxWidth - 100) + 100
        const stair = stairSchema({ x, y, width })
        stairs.push(stair)
    }

    return stairs
}

function createCards(stairs) {}

module.exports = new MatchController()
