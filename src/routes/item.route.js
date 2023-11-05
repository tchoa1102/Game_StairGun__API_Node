const express = require('express')
const router = express.Router()
const { ItemController } = require('../app/controllers')

router.get('/', ItemController.getAll)
router.post('/buy', ItemController.buy)

module.exports = router
