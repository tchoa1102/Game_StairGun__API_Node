class CardController {
    createListCards(idMath, stairs) {
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
}
