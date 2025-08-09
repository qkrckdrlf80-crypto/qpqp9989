import express from 'express';
import Stock from '../models/Stock.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const stock = new Stock({
        name: req.body.name,
        price: req.body.price,
    });

    try {
        const newStock = await stock.save();
        res.status(201).json(newStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        await stock.deleteOne();
        res.json({ message: 'Stock deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
