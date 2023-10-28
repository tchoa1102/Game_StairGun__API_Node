const express = require('express')
const router = express.Router()
const { CardController } = require('../app/controllers')

router.get('/', CardController.getAll)

module.exports = router
