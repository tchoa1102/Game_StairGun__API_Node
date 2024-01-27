import { ItemModel, UserModel } from '../../../../app/models'

class Item {
    public _id: string
    public socket: any
    public io: any
    constructor(socket: any, io: any) {
        this._id = socket.handshake.idPlayer
        this.socket = socket
        this.io = io
    }

    // on | emit: | return Array[item]
    async wearOrUnbindEquip({ _id, type }: { _id: string; type: any }, callback: any) {
        try {
            console.log('hello: ', _id, type)
            const resArray = []
            const statusUpdate: Record<string, number> = {}
            const user: any = await UserModel.findById(this._id).populate('bag.data').lean()
            const itemWasWorn = user.bag.find((item: any) => item.isWear && item.data.type === type)
            const itemIsGoingWear = user.bag.find(
                (item: any) => !item.isWear && item._id.toString() === _id,
            )
            console.log('itemWasWorn: ', itemWasWorn, 'itemIsGoingWear: ', itemIsGoingWear)

            if (itemWasWorn) {
                const typeWear = itemWasWorn.data.type
                itemWasWorn.isWear = false
                itemWasWorn.data.properties.forEach((property: any) => {
                    const newValue = JSON.parse(user[property.type]) - property.value
                    user[property.type] = JSON.stringify(newValue)
                    statusUpdate[property.type] = user[property.type]
                })
                user.looks[typeWear] = ''
                resArray.push(itemWasWorn)
                // console.log(itemWasWorn)
            }

            if (itemIsGoingWear) {
                const typeWear = itemIsGoingWear.data.type
                itemIsGoingWear.isWear = true
                itemIsGoingWear.data.properties.forEach((property: any) => {
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
                itemsBag: resArray,
            })
        } catch (e) {
            console.log(e)
            return
        }
    }
}

export default Item
