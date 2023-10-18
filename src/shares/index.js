const mongoose = require('mongoose')
const nerdamer = require('nerdamer')
const math = require('mathjs')
const config = require('../gameConfig.json')
const { stairSchema } = require('../app/schemas')
require('nerdamer/Algebra')
require('nerdamer/Calculus')
require('nerdamer/Solve')
require('nerdamer/Extra')
function createLineFromTwoPoint(p1, p2) {
    const n = {
        x: p1.y - p2.y,
        y: p2.x - p1.x,
    }
    // n.x(x - p1.x) + n.y(y - p1.y) = 0
    // => y = - n.x/n.y(x - p1.x) + p1.y
    // => y = (-n.x/n.y) * x + (n.x/n.y * p1.x + p1.y)

    //      x^2, x,          y,     c
    return [[0, -n.x / n.y, -1], [(n.x / n.y) * p1.x + p1.y]]
}

function findIntersectionXLevel2(line1, line2) {
    // console.log(
    //     '\n\n\n',
    //     // math.lusolve(
    //     //     [
    //     //         [1, 0, -1],
    //     //         [0, 1, 1],
    //     //         [0, 0, 0],
    //     //     ],
    //     //     [[1], [1], [0]],
    //     // ),
    //     math.lusolve(
    //         [
    //             [0, 1],
    //             [0, 1],
    //         ],
    //         [[1], [2]],
    //     ),
    //     '\n\n\n',
    // )
    // line1: d1y = a1x^2 + b1x + c1, line2: d2y = a2x^2 + b2x + c2
    // |[a1, b1, d1]| = |c1|
    // |[a2, b2, d2]| = |c2|
    // |[0, 0, 0]   | = |0|
    // const matrixVar = [line1[0], line2[0]]
    // const matrixC = [[...line1[1]], [...line2[1]]]

    try {
        // collision between two straights line
        // if (matrixVar[0].length < 3 && matrixVar[1].length < 3) {
        //     let intersection = undefined
        //     intersection = math.lusolve(matrixVar, matrixC)
        //     return intersection || undefined
        // }
        // collision between curved line and straight line
        // if (matrixVar[0].length >= 3 || matrixVar[1].length >= 3) {
        // }
        // const curvedLine = line1[0].length >= 3 ? line1 : line2
        // const straightLine = line1[0].length < 3 ? line1 : line2

        const evaluate = `${line1[0][0]}x^2 + (${line1[0][1]})x + (${line1[1][0]}) = ${line2[0][0]}x^2 + ${line2[0][1]}x + ${line2[1][0]}`
        console.log(evaluate)
        const x = nerdamer.solve(evaluate, 'x').text()

        if (x.indexOf('i') !== -1) return undefined
        const listX = JSON.parse(x)
        const listY = listX.map((x) => {
            const evaluate = `${line1[0][0]}x^2 + (${line1[0][1]})x + (${line1[1][0]})`
            const y = JSON.parse(math.simplify(evaluate, { x }).toString())
            return y
        })
        return [listX, listY]
    } catch (error) {
        console.log('Two lines parallel!')
    }
}

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

function createCards(stairs) {
    // @return Array[]
    const cards = []
    const stairsPassed = []
    while (cards.length < config.maxCard) {
        // find unique stair
        let i = Math.floor(Math.random() * config.stairs.length)
        while (stairsPassed.find((j) => j === i) === undefined) {
            i = Math.floor(Math.random() * config.stairs.length)
        }
        const selectedUniqueStair = stair[i]

        // find location x on stair
        const x = Math.floor(Math.random() * selectedUniqueStair.width) + selectedUniqueStair.x

        // result
    }
}

module.exports = {
    createStairs,
    createCards,
    createLineFromTwoPoint,
    findIntersectionXLevel2,
}
