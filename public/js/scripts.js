document.addEventListener('DOMContentLoaded', async () => {
    console.log("✅ DOMContentLoaded 이벤트 발생");

    const token = localStorage.getItem('token');

    // 토큰 만료 검사 함수
    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.exp) return true;
            const now = Math.floor(Date.now() / 1000);
            return payload.exp < now;
        } catch (e) {
            return true; // 오류나면 만료된 걸로 간주
        }
    };

    // 버튼 상태 업데이트 함수
    const updateButtonState = (isLoggedIn) => {
        const greeting = document.getElementById('greeting');
        const balanceElement = document.getElementById('balance');
        const logoutButton = document.getElementById('logout');
        const loginButton = document.getElementById('login-btn');
        const signupButton = document.getElementById('signup-btn');
        const ownedStocksButton = document.getElementById('owned-btn');

        if (isLoggedIn) {
            if (greeting) greeting.style.display = 'block';
            if (balanceElement) balanceElement.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'block';
            if (loginButton) loginButton.style.display = 'none';
            if (signupButton) signupButton.style.display = 'none';
            if (ownedStocksButton) ownedStocksButton.style.display = 'block';
        } else {
            if (greeting) greeting.textContent = '로그인해주세요.';
            if (balanceElement) balanceElement.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
            if (loginButton) loginButton.style.display = 'block';
            if (signupButton) signupButton.style.display = 'block';
            if (ownedStocksButton) ownedStocksButton.style.display = 'none';
        }
    };

    // 인증 포함 fetch 함수 (401 감지 시 강제 로그아웃 처리)
    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        if (!options.headers) options.headers = {};
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(url, options);

        if (response.status === 401) {
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            localStorage.removeItem('token');
            updateButtonState(false);
            window.location.href = './login.html';
            throw new Error('Unauthorized');
        }

        return response;
    };

    const updateBalance = async () => {
        const balanceElement = document.getElementById('balance');
        console.log('📢 balanceElement:', balanceElement); // HTML 요소 확인
        if (!balanceElement) {
            console.error('❌ balanceElement를 찾을 수 없습니다.');
            return;
        }

        try {
            const response = await fetchWithAuth('/api/balance'); // 경로 수정
            console.log('📢 응답 상태:', response.status); // 응답 상태 확인
            if (!response.ok) throw new Error('예수금 데이터를 가져오는 중 오류 발생');

            const data = await response.json();
            console.log('📢 API 응답 데이터:', data); // API 응답 데이터 확인
            const balance = data.balance || 0;

            // 예수금 UI 업데이트
            balanceElement.innerHTML = `예수금: <span class="amount">${balance.toLocaleString()}</span> 원`;
        } catch (error) {
            console.error('❌ 예수금 업데이트 오류:', error.message);
            balanceElement.innerHTML = '예수금: <span class="amount">0</span> 원'; // 기본값
        }
    };

    // 보유 종목 버튼 클릭 시 페이지 이동
    const ownedStocksButton = document.getElementById('owned-btn');
    if (ownedStocksButton) {
        ownedStocksButton.addEventListener('click', function() {
            window.location.href = '/owned.html';  // 보유 종목 페이지로 이동
        });
    }

    // JWT 토큰 디코딩 함수
    const decodeToken = (token) => {
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) throw new Error('잘못된 JWT 토큰 형식');

            const payload = tokenParts[1];
            const decodedPayload = JSON.parse(decodeURIComponent(
                atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
                    .split('') 
                    .map(c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`) 
                    .join('')
            ));
            return decodedPayload;
        } catch (error) {
            console.error('JWT 토큰 디코딩 오류:', error);
            return null;
        }
    };

    

    // 로딩 메시지 표시
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.classList.remove('hidden');

    // 보유 종목 렌더링 함수
    const renderOwnedStocks = async (token) => {
        const stockList = document.getElementById('owned-stock-list');
        if (!stockList) return;

        try {
            if (loadingMessage) loadingMessage.classList.remove('hidden');

            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await fetchWithAuth('/api/stocks', { method: 'GET', headers });

            if (!response.ok) throw new Error('보유 종목 데이터를 가져오는 중 오류 발생');

            const data = await response.json();
            console.log("📢 보유 종목 API 응답 데이터:", data);

            stockList.innerHTML = '';

            const stocks = data.stocks || [];
            if (stocks.length === 0) {
                stockList.innerHTML = '<p class="no-stocks-message">보유 종목이 없습니다.</p>';
            } else {
                stocks.forEach((stock) => {
                    const li = document.createElement('li');
                    li.classList.add('stock-item');

                    const totalValue = stock.quantity * stock.price;
                    li.innerHTML = `
                        <div class="stock-info">
                            <img src="${stock.logo}" alt="${stock.name} 로고" class="owned-stock-logo">
                            <div class="stock-details">
                                <span><strong>${stock.name}</strong> (${stock.ticker})</span>
                                <span><strong>상장 예정일:</strong> ${new Date(stock.listingDate).toLocaleDateString()}</span>
                                <span><strong>수량:</strong> ${stock.quantity}주</span>
                                <span><strong>가격:</strong> ${stock.price.toLocaleString()}원</span>
                                <span><strong>보유 자산:</strong> ${totalValue.toLocaleString()}원</span>
                            </div>
                        </div>
                        <div class="stock-actions">
                            <button class="deposit-button" data-listing-date="${stock.listingDate}">내 증권 계좌로 입고</button>
                        </div>
                    `;
                    stockList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("❌ 보유 종목 오류:", error.message);
            stockList.innerHTML = '<p>보유 종목 데이터를 불러오는 데 실패했습니다.</p>';
        } finally {
            if (loadingMessage) loadingMessage.classList.add('hidden');

            document.querySelectorAll('.deposit-button').forEach((button) => {
                button.addEventListener('click', () => {
                    const listingDate = new Date(button.dataset.listingDate);
                    const today = new Date();
                    const dayBeforeListing = new Date(listingDate);
                    dayBeforeListing.setDate(listingDate.getDate() - 1);

                    if (today >= dayBeforeListing) {
                        alert('연결된 증권계좌로 자동으로 입고됩니다.');
                    } else {
                        alert('상장 전일에만 입고 가능합니다.');
                    }
                });
            });
        }
    };

    // 로그아웃 처리 함수
    const setupLogout = () => {
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                alert('로그아웃되었습니다.');
                window.location.reload();
            });
        }
    };

    // 로그인 & 회원가입 버튼 이벤트
    const loginButton = document.getElementById('login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = './login.html';
        });
    }

    const signupButton = document.getElementById('signup-btn');
    if (signupButton) {
        signupButton.addEventListener('click', () => {
            window.location.href = './signup.html';
        });
    }

    // 토큰 만료 체크 후 처리
    if (token && isTokenExpired(token)) {
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        updateButtonState(false);
        window.location.href = './login.html';
        return;
    }

    // 로그인 상태 확인 및 UI 업데이트
    if (token) {
        const decodedPayload = decodeToken(token);
        if (decodedPayload) {
            const greeting = document.getElementById('greeting');
            if (greeting) {
                greeting.textContent = `환영합니다, ${decodedPayload.name}님!`;
            }
            updateButtonState(true);

            await updateBalance();  // 여기에 호출 추가함

            if (window.location.pathname.includes('owned.html')) {
                await renderOwnedStocks(token);
            }

            setupLogout();
        } else {
            localStorage.removeItem('token');
            alert('로그인 상태를 확인할 수 없습니다. 다시 로그인해주세요.');
            updateButtonState(false);
        }
    } else {
        updateButtonState(false);
    }
});
