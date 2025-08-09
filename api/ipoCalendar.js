// 파일 위치: /api/ipoCalendar.js

export default function handler(req, res) {
    const upcomingIpos = [
      {
        name: "쎄크",
        dDay: "D-13",
        date: "04.17 예정",
        price: "13,000 ~ 15,000원",
        logo: "https://static.ustockplus.com/logo/company/71025.png"
      },
      {
        name: "바이오비쥬",
        dDay: "D-17",
        date: "04.21 예정",
        price: "8,000 ~ 9,100원",
        logo: "https://static.ustockplus.com/logo/company/70382.png"
      },
      {
        name: "로킷헬스케어",
        dDay: "D-19",
        date: "04.23 예정",
        price: "11,000 ~ 13,000원",
        logo: "https://static.ustockplus.com/logo/company/67920.png"
      },
      // 나머지 종목 8개도 여기에 추가
    ];
  
    res.status(200).json({ status: "ok", data: upcomingIpos });
  }
  