const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // Add other fields as necessary
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 