const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAllMenuItems);
router.post('/', menuController.createMenuItem);
router.get('/:id', menuController.getMenuItemById);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);
router.get('/menu/categories', menuController.getAllCategories);
router.get('/menu/category/:category', menuController.getMenuItemsByCategory);

module.exports = router;