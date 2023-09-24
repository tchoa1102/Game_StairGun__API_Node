const express = require('express')
const router = express.Router()
const { RoomController } = require('../app/controllers')

router.get('/', RoomController.getAll)

module.exports = router
