const { UserModel, ItemModel } = require('../models')
const { Item } = require('../schemas/item.schema')

class ItemController {
	// [GET] /api/items/
	async getAll(req, res, next) {
		try {
			const items = await ItemModel.find({}).lean()
			return res.json({
				data: items
			})
		} catch (e) {
			return next(e)
		}

	}

	// [POST] /api/items/buy
	async buy(req, res, next) {
		try {
			console.log('buy')
	        const dataUser = req.user
	        const id = dataUser.firebase.identities['google.com']
			const data = req.body
	        const user = await UserModel.findById(id).lean()
			const item = await ItemModel.findById(data._id).lean()
			console.log('load data')

			if (user.gold < item.price) return
			user.gold -= item.price

			const itemNew = new Item(item._id)
			user.bag.push(itemNew)

			itemNew.data = item
			console.log(itemNew)
			const dataRes = {
				data: {
					item: itemNew,
					player: {gold: user.gold},
				}
			}
			await UserModel.updateOne({ _id: user._id }, { gold: user.gold, bag: user.bag })
			return res.json(dataRes)
		} catch(e) {
			return next(e)
		}
	}

	// [POST] /api/items/sell
	async sellItem(req, res, next) {
		try {
	        const dataUser = req.user
	        const id = dataUser.firebase.identities['google.com']
			const data = req.body
	        const user = await UserModel.findById(id).populate('bag.data').lean()

			const itemIndex = Array.from(user.bag).findIndex(i => i._id === data._id)
			if (itemIndex === -1) return res.status(404).json({ message: 'Not Found' })
			const item = user.bag.splice(itemIndex, 1)

			user.gold += item.data.price * 0.7
			await UserModel.updateOne({ _id: user._id }, user)

			return res.json({
				data: {
					item,
					player: {
						gold: user.gold
					}
				}
			})
		} catch(e) {
			return next(e)
		}
	}
}

module.exports = new ItemController