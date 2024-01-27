import { UserModel, FriendModel } from '../models'

class AuthController {
    // [GET] /api/auth/load
    async load(req: any, res: any, next: any) {
        const dataUser: any = req.user
        const id: string = dataUser.firebase.identities['google.com']

        const user: any = await UserModel.findById(id).populate('bag.data').lean()
        const friends: any = await FriendModel.find({
            $or: [{ player1: id }, { player2: id }],
        })
            .populate('player1')
            .populate('player2')
            .lean()
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const friendEdited = friends.map((friend: any) => {
            if (friend.player1._id.toString() === user._id.toString()) {
                return configData(friend.player2)
            } else if (friend.player2._id.toString() === user._id.toString()) {
                return configData(friend.player1)
            }

            function configData(oldData: any) {
                return {
                    _id: oldData._id,
                    name: oldData.name,
                    picture: oldData.picture,
                    level: oldData.lever,
                    socketId: oldData.socketId,
                }
            }
        })
        user.friends = friendEdited
        // console.log('player loaded: ', user)
        return res.json(user)
    }
}

export default new AuthController()
