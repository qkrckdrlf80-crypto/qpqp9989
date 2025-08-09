import { MongoClient } from 'mongodb'; // MongoDB 클라이언트 가져오기
import jwt from 'jsonwebtoken'; // JWT 모듈 가져오기

const uri = process.env.MONGODB_URI; // MongoDB URI 환경 변수
const client = new MongoClient(uri); // MongoClient 초기화

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // JWT 비밀 키

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
        }

        try {
            // JWT 토큰 디코딩
            let decoded;
            try {
                decoded = jwt.verify(token, JWT_SECRET);
                console.log('디코딩된 JWT:', decoded);
            } catch (error) {
                console.error('JWT 디코딩 오류:', error.message);
                return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
            }

            // MongoDB 연결
            try {
                await client.connect();
            } catch (error) {
                console.error('MongoDB 연결 오류:', error.message);
                return res.status(500).json({ message: '데이터베이스 연결에 실패했습니다.' });
            }

            const database = client.db('stockDB');
            const users = database.collection('users');

            // 사용자 검색
            const user = await users.findOne({ username: decoded.username });
            console.log('검색된 사용자:', user);

            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 사용자별 주식 데이터 반환
            res.setHeader('Cache-Control', 'no-store'); // 캐시 비활성화
            res.status(200).json({ stocks: user.stocks || [] });
        } catch (error) {
            console.error('주식 데이터 로드 오류:', error.message);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        } finally {
            try {
                await client.close(); // MongoDB 연결 닫기
            } catch (error) {
                console.error('MongoDB 연결 닫기 오류:', error.message);
            }
        }
    } else {
        res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
    }
}
