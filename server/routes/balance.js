// routes/balance.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/balance', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('디코딩된 JWT:', decoded);

        const user = await User.findOne({ username: decoded.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('검색된 사용자:', user);

        res.status(200).json({ balance: user.balance || 0 });
    } catch (error) {
        console.error('❌ 예수금 가져오기 오류:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
