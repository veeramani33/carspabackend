const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Service'
        },
        vehicleNo: {
            type: String,
            required: true
        },
        clientname: {
            type: String,
            required: true
        },
        mobileNo: {
            type: String,
            required: true
        },
        requirment: {
            type: String,
            default: null
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Note', noteSchema)