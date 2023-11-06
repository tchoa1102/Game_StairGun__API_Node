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
	        const dataUser = req.user
	        const id = dataUser.firebase.identities['google.com']
			const data = req.body
	        const user = await UserModel.findById(id).lean()
			const item = await ItemModel.findById(data._id).lean()

			if (user.gold < item.price) return
			user.gold -= item.price

			const itemNew = new Item(item._id)
			user.bag.push(itemNew)

			await UserModel.updateOne({ _id: user._id }, { gold: user.gold, bag: user.bag })
			itemNew.data = item
			return res.json({ data: {
				item: itemNew,
				user: {gold},
			} })
		} catch(e) {
			return next(e)
		}
	}
}

module.exports = new ItemController