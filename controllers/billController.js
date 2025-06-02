const Bill = require('../models/bill');
const Table = require('../models/table');

const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('items.menuItem').sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBillFromTable = async (req, res) => {
    try {
        const { tableNumber } = req.body;
    
        const table = await Table.findOne({ tableNumber }).populate('currentOrder.menuItem');
        if (!table || table.currentOrder.length === 0) {
            return res.status(404).json({ message: 'Table not found or no items ordered' });
        }

    // Calculate total amount
        let totalAmount = 0;
        const billItems = table.currentOrder.map(item => {
            const itemTotal = item.menuItem.price * item.quantity;
            totalAmount += itemTotal;
            return {
                menuItem: item.menuItem._id,
                quantity: item.quantity,
                price: item.menuItem.price,
                note: item.note
            };
        });

        const bill = new Bill({
            tableNumber,
            items: billItems,
            totalAmount
        });

        const savedBill = await bill.save();
    
    // Clear table order
        table.currentOrder = [];
        table.isAvailable = true;
        await table.save();

        const populatedBill = await Bill.findById(savedBill._id).populate('items.menuItem');
        res.status(201).json(populatedBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('items.menuItem');
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
    res.json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBillStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bill = await Bill.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                paidAt: status === 'paid' ? new Date() : undefined
            },
            { new: true }
        ).populate('items.menuItem');
    
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllBills,
    createBillFromTable,
    getBillById,
    updateBillStatus
};