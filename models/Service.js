const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    servicename: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Service', serviceSchema)