import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const url = "https://www.seoulexchange.kr/api/v2/stocks/?perPage=&structure=tui_grid&filtering=popular&max_size=10&page=1";
        const response = await axios.get(url);

        console.log("✅ Express 서버 응답 데이터:", response.data);

        const ipoData = response.data?.data?.contents;
        if (!Array.isArray(ipoData)) {
            return res.status(500).json({ error: "API 응답 데이터가 배열이 아님" });
        }

        res.status(200).json(ipoData);
    } catch (error) {
        console.error("❌ IPO 데이터 가져오기 실패:", error.message);
        res.status(500).json({ error: "데이터 가져오기 실패" });
    }
});

export default router;
