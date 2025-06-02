const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    items: [{
        menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
        },
        quantity: {
        type: Number,
        required: true,
        min: 1
        },
        price: {
        type: Number,
        required: true
        },
        note: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paidAt: Date
});

module.exports = mongoose.model('Bill', billSchema);