const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentOrder: [{
        menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
        },
        quantity: {
        type: Number,
        default: 1
        },
        note: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Table', tableSchema);