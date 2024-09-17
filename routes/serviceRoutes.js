const express = require('express')
const router = express.Router()
const servicesController = require('../controllers/servicesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(servicesController.getAllServices)
    .post(servicesController.createNewService)
    .patch(servicesController.updateService)
    .delete(servicesController.deleteService)

module.exports = router