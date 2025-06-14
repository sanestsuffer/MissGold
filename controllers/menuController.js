const Menu = require('../models/menu');

const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMenuItem = async (req, res) => {
    try {
        const { name, price, image, category } = req.body;
        const menuItem = new Menu({
            name,
            price,
            image,
            category,
        });
        const savedMenuItem = await menuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const updatedMenuItem = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Menu.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMenuItemsByCategory = async (req, res) => {
    try {
        const categoryName = req.params.category;  // /api/menu/category/:category
        const menuItems = await Menu.find({ category: categoryName });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMenuItems,
    createMenuItem,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    getAllCategories,
    getMenuItemsByCategory
};