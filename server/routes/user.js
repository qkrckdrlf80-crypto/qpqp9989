import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/stocks', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ stocks: user.stocks });
    } catch (error) {
        console.error('사용자 주식 정보 로드 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

router.get('/balance', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ balance: user.balance });
    } catch (error) {
        console.error('❌ 예수금 가져오기 오류:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/balance', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const { amount } = req.body;

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.balance += amount;
        await user.save();

        res.json({ balance: user.balance });
    } catch (error) {
        console.error('❌ 예수금 업데이트 오류:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
