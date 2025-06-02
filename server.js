const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const tableRoutes = require('./routes/tableRoutes');
const menuRoutes = require('./routes/menuRoutes');
const billRoutes = require('./routes/billRoutes');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/restaurant_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.use('/api/table', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bill', billRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/menu', 'menu.html'));
});
app.get('/bill', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/bill', 'bill.html'));
});
app.get('/table', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/table', 'table.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
