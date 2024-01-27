import { CardOnMatchModel, CardModel } from '../models'
const config = require('../../gameConfig.json')

class CardController {
    async getAll(req: any, res: any, next: any) {
        const cards = await CardModel.find({}).lean()

        return res.json(cards)
    }

    async createListCards(idMatch: string, stairs: Array<any>) {
        // @return Array[]
        const cardsModel = await CardModel.find().lean()
        const cards = []
        const cardsDetail = []
        const stairsPassed = []
        // console.log(cards.length, config.maxCard, stairsPassed.length, stairs.length)
        while (cards.length < config.maxCard) {
            // find unique stair
            let i = Math.floor(Math.random() * stairs.length)
            // console.log(i)
            while (stairsPassed.find((j) => j === i) !== undefined) {
                i = Math.floor(Math.random() * stairs.length)
            }
            stairsPassed.push(i)
            const selectedUniqueStair = stairs[i]

            // find location x on stair
            const x = Math.floor(Math.random() * selectedUniqueStair.width) + selectedUniqueStair.x
            const cardSelected = cardsModel[Math.floor(Math.random() * cardsModel.length)]

            // result
            const card = new CardOnMatchModel({
                x,
                y: selectedUniqueStair.y,
                match: idMatch,
                data: cardSelected._id,
            })
            await card.save()
            const cardDetail: any = card.toObject()
            cardDetail.data = cardSelected
            cards.push(card)
            cardsDetail.push(cardDetail)
        }

        // console.log('Card created: ', cards)

        return { cards, cardsDetail }
    }
}

export default new CardController()
