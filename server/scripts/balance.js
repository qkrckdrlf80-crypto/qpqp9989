import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dlwlgur12:qpqp998974@cluster0.nfxnf.mongodb.net/stockdb?retryWrites=true&w=majority';

const updateUserBalances = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB 연결 성공');

        // balance 필드가 없는 사용자도 있으면 0으로 초기화
        const result = await User.updateMany(
            { balance: { $exists: false } },
            { $set: { balance: 0 } }
        );
        console.log(`✅ ${result.modifiedCount}명의 사용자에 balance 필드가 추가/업데이트되었습니다.`);

    } catch (error) {
        console.error('❌ 사용자 balance 필드 업데이트 중 오류 발생:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB 연결 종료');
    }
};

updateUserBalances();
