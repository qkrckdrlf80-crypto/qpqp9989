import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, phone, username, password, brokerage, accountNumber } = req.body;

        if (!name || !phone || !username || !password || !brokerage || !accountNumber) {
            return res.status(400).json({ error: '모든 필드를 입력하세요.' });
        }

        try {
            await client.connect();
            const database = client.db('stockDB');
            const users = database.collection('users');

            const existingUser = await users.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await users.insertOne({
                name,
                phone,
                username,
                password: hashedPassword,
                brokerage,
                accountNumber,
                balance: 0, // 명시적으로 balance 필드 추가
                createdAt: new Date()
            });

            res.status(201).json({ message: '회원가입 성공' });
        } catch (error) {
            console.error('회원가입 오류:', error);
            res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
    }
}
