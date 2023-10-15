const mongoose = require('mongoose')
const math = require('mathjs')
const config = require('../gameConfig.json')
const { stairSchema } = require('../app/schemas')

function createStairs() {
    // @return Array[]
    const stairs = []
    for (let i = 0; i < config.maxStair; i++) {
        let width = Math.random() * (config.stair.maxWidth - 100) + 100
        let x = 0
        do {
            x = Math.random() * (config.maxWidthStairGame - 100)
        } while (stairs.find((stair) => stair.x === x) !== undefined)
        let y = 0
        do {
            y = Math.random() * (config.maxHeightStairGame - 400) + 300
        } while (stairs.find((stair) => stair.y === y) !== undefined)
        const SStair = mongoose.model('stairschema', stairSchema)
        const stair = new SStair({ x, y, width })
        stairs.push(stair)
    }

    return stairs
}

function createCards(stairs) {}

function checkCollision(mainShape, targetShape) {}

module.exports = {
    createStairs,
    createCards,
}
