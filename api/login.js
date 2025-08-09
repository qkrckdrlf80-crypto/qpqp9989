import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            await client.connect();
            const database = client.db('stockDB');
            const users = database.collection('users');

            const user = await users.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
            }

            // ✅ JWT에 name 포함
            const token = jwt.sign(
                { username: user.username, name: user.name },  // ✅ name 포함!
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(200).json({ message: '로그인 성공!', token });
        } catch (error) {
            console.error('로그인 오류:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
    }
}
