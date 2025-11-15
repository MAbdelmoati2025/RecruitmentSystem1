// ============================================
// Helper Functions
// ============================================

/**
 * Validate login inputs
 * @param {string} username 
 * @param {string} password 
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateLoginInputs(username, password) {
    if (!username || !username.trim()) {
        return {
            valid: false,
            message: 'الرجاء إدخال اسم المستخدم'
        };
    }

    if (!password || !password.trim()) {
        return {
            valid: false,
            message: 'الرجاء إدخال كلمة المرور'
        };
    }

    if (username.trim().length < 3) {
        return {
            valid: false,
            message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'
        };
    }

    return { valid: true };
}

/**
 * Clear form inputs
 */
export function clearLoginForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

/**
 * Enable/Disable login button
 * @param {boolean} disabled 
 */
export function setLoginButtonState(disabled) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.disabled = disabled;
    }
}