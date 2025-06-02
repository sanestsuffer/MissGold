const Table = require('../models/table');
const Menu = require('../models/menu');

const getAllTables = async (req, res) => {
    try {
        const tables = await Table.find().populate('currentOrder.menuItem');
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTable = async (req, res) => {
    try {
        const { tableNumber } = req.body;
        const table = new Table({ tableNumber });
        const savedTable = await table.save();
        res.status(201).json(savedTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTableByNumber = async (req, res) => {
    try {
        const table = await Table.findOne({ tableNumber: req.params.number })
            .populate('currentOrder.menuItem');
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addItemToTable = async (req, res) => {
    try {
        const { tableNumber } = req.params;
        const { menuItemId, quantity, note } = req.body;

        const table = await Table.findOne({ tableNumber });
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

    // Check if item already exists in current order
        const existingItem = table.currentOrder.find(
            item => item.menuItem.toString() === menuItemId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            table.currentOrder.push({
                menuItem: menuItemId,
                quantity,
                note
            });
        }

        table.isAvailable = false;
        await table.save();
    
        const updatedTable = await Table.findOne({ tableNumber })
            .populate('currentOrder.menuItem');
        res.json(updatedTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const removeItemFromTable = async (req, res) => {
    try {
        const { tableNumber, itemId } = req.params;
    
        const table = await Table.findOne({ tableNumber });
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        table.currentOrder = table.currentOrder.filter(
            item => item._id.toString() !== itemId
        );

        if (table.currentOrder.length === 0) {
            table.isAvailable = true;
        }

        await table.save();
    
        const updatedTable = await Table.findOne({ tableNumber })
            .populate('currentOrder.menuItem');
        res.json(updatedTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTable = async (req, res) => {
    try {
        await Table.findOneAndDelete({ tableNumber: req.params.number });
        res.json({ message: 'Table deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTables,
    createTable,
    getTableByNumber,
    addItemToTable,
    removeItemFromTable,
    deleteTable
};