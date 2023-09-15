const mongoose = require('mongoose')
const config = require('../../gameConfig.json')

const { stairSchema } = require('../schemas')
const { CharacterModel, MapModel } = require('../models')

class MatchController {
    // [GET] /api/matches/:match/users/:user
    async get(req, res, next) {
        return res.json({ message: 'Hello matches' })
    }

    // [POST] /api/matches
    async create(req, res, next) {
        const listPlayer = req.listPlayer

        const listStair = createStairs()
        const characterModel = CharacterModel
        const characters = await characterModel.find({
            name: /stick-/,
        })
        const maps = await MapModel.find()
        const mapChosenIndex = Math.floor(Math.random() * maps.length)
        const map = maps[mapChosenIndex]
        const configCircleStick = require('../../../' + characters[0].srcConfig)
        const players = [
            {
                _id: '1',
                name: 'a',
            },
        ]

        return res.json({
            message: '',
            data: {
                players,
                stairs: listStair,
                stickConfig: configCircleStick,
                tiledMapConfig: map?.srcConfig,
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
            y = Math.random() * (config.maxHeightStairGame - 400) + 300
        } while (stairs.find((stair) => stair.y === y) !== undefined)
        let width = Math.random() * (config.stair.maxWidth - 100) + 100
        const SStair = mongoose.model('stairschema', stairSchema)
        const stair = new SStair({ x, y, width })
        stairs.push(stair)
    }

    return stairs
}

function createCards(stairs) {}

module.exports = new MatchController()
