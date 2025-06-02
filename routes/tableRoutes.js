const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getAllTables);
router.post('/', tableController.createTable);
router.get('/:number', tableController.getTableByNumber);
router.post('/:tableNumber/items', tableController.addItemToTable);
router.delete('/:tableNumber/items/:itemId', tableController.removeItemFromTable);
router.delete('/:number', tableController.deleteTable);

module.exports = router;