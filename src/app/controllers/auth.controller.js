const { UserModel } = require('../models')

class AuthController {
    // [GET] /api/auth/load
    async load(req, res, next) {
        const dataUser = req.user
        const id = dataUser.firebase.identities['google.com']
        const user = await UserModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.json(user)
    }
}

module.exports = new AuthController()
