const { ItemModel, UserModel } = require('../../../../app/models')

class Item {
	constructor(socket, io) {
		this._id = socket.handshake.idPlayer
		this.socket = socket
		this.io = io
	}

	// on | emit: | return Array[item]
	async wearOrUnbindEquip({ _id, type }, callback) {
		try {
			console.log('hello: ', _id, type)
			const resArray = []
			const statusUpdate = {}
			const user = await UserModel.findById(this._id).populate('bag.data').lean()
			const itemWasWorn = user.bag.find(item => item.isWear && item.data.type === type)
			const itemIsGoingWear = user.bag.find(item => !item.isWear && item._id.toString() === _id)
			console.log('itemWasWorn: ', itemWasWorn, 'itemIsGoingWear: ', itemIsGoingWear)

			if (itemWasWorn) {
				const typeWear = itemWasWorn.data.type
				itemWasWorn.isWear = false
				itemWasWorn.data.properties.forEach(property => {
					const newValue = JSON.parse(user[property.type]) - property.value
					user[property.type] = JSON.stringify(newValue)
					statusUpdate[property.type] = user[property.type]
				})
				user.looks[typeWear] = ""
				resArray.push(itemWasWorn)
				// console.log(itemWasWorn)
			}

			if (itemIsGoingWear) {
				const typeWear = itemIsGoingWear.data.type
				itemIsGoingWear.isWear = true
				itemIsGoingWear.data.properties.forEach(property => {
					const newValue = JSON.parse(user[property.type]) + property.value
					user[property.type] = JSON.stringify(newValue)
					statusUpdate[property.type] = user[property.type]
				})
				user.looks[typeWear] = itemIsGoingWear.data.texture
				resArray.push(itemIsGoingWear)
				// console.log(itemWasWorn)
			}

			await UserModel.updateOne({ _id: user._id }, user)
			return callback({
				status: statusUpdate,
				looks: user.looks,
				itemsBag: resArray
			})
		} catch(e) {
			console.log(e)
			return
		}
	}
}

module.exports = Item