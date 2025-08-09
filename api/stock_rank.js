import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'public', 'stock_rank.json');
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error('JSON 파일 읽기 오류:', error);
        res.status(500).json({ message: '데이터를 불러오는 데 실패했습니다.' });
    }
}
