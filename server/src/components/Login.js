// ============================================
// Login Component
// ============================================

export function createLoginPage() {
    return `
        <div id="loginPage" class="container">
            <h1>مرحباً بك! 👋</h1>
            <p class="subtitle">نظام إدارة الموظفين</p>
            
            <div class="demo-info">
                <strong>حسابات تجريبية:</strong>
                Username: admin | Password: 123456<br>
                Username: employee1 | Password: 123456
            </div>

            <div class="input-group">
                <label for="username">اسم المستخدم</label>
                <input type="text" id="username" placeholder="أدخل اسم المستخدم">
            </div>

            <div class="input-group">
                <label for="password">كلمة المرور</label>
                <input type="password" id="password" placeholder="أدخل كلمة المرور">
            </div>

            <button id="loginBtn">دخول</button>
            
            <div class="message error" id="errorMsg"></div>
            <div class="message success" id="successMsg"></div>
            <div class="message loading" id="loadingMsg">جاري التحقق...</div>
        </div>
    `;
}

export function setupLoginListeners(onLogin) {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Login button click
    loginBtn.addEventListener('click', onLogin);

    // Enter key on password field
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            onLogin();
        }
    });

    // Enter key on username field
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
}