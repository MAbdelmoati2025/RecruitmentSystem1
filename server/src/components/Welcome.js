// ============================================
// Welcome Component
// ============================================

export function createWelcomePage(employee) {
    return `
        <div id="welcomePage" class="welcome-page">
            <div class="emoji">🎉</div>
            <h1>هاي!</h1>
            <p>أهلاً يا <span id="displayName">${employee.fullName}</span></p>
            
            <div class="employee-info">
                <p><strong>الاسم الكامل:</strong> <span id="fullName">${employee.fullName}</span></p>
                <p><strong>الوظيفة:</strong> <span id="position">${employee.position || 'غير محدد'}</span></p>
                <p><strong>البريد الإلكتروني:</strong> <span id="email">${employee.email || 'غير محدد'}</span></p>
            </div>

            <button class="logout-btn" id="logoutBtn">تسجيل الخروج</button>
        </div>
    `;
}

export function setupWelcomeListeners(onLogout) {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', onLogout);
}