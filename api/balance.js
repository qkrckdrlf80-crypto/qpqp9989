// api/balance.js
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await client.connect();

    const db = client.db('stockDB'); // stockDB로 통일
    const users = db.collection('users');

    const user = await users.findOne({ username: decoded.username }); // username 기반
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ balance: user.balance || 0 });
  } catch (err) {
    console.error('Balance API 오류:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  } finally {
    await client.close();
  }
}
