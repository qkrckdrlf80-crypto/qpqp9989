const mongoose = require('mongoose');

// Define the Stock schema
const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    symbol: { type: String, required: true }, // 주식 심볼
    createdAt: { type: Date, default: Date.now }, // 생성 날짜
});

// Export the Stock model
module.exports = mongoose.model('Stock', stockSchema);