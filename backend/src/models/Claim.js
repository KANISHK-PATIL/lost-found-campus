const mongoose = require('mongoose')
const Item = require('./Item')

const claimSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        claimant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    }
)

module.exports = mongoose.model('Claim',claimSchema)