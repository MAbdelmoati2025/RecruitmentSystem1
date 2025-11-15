// ============================================
// Main Application
// ============================================

import { createLoginPage, setupLoginListeners } from './components/Login.js';
import { createWelcomePage, setupWelcomeListeners } from './components/Welcome.js';
import { showMessage, hideAllMessages } from './components/Message.js';
import { authAPI } from './services/api.js';
import { validateLoginInputs, clearLoginForm, setLoginButtonState } from './utils/helpers.js';

// ============================================
// State Management
// ============================================

let currentEmployee = null;

// ============================================
// App Initialization
// ============================================

function initApp() {
    const app = document.getElementById('app');
    
    // Show login page by default
    app.innerHTML = createLoginPage();
    setupLoginListeners(handleLogin);
}

// ============================================
// Login Handler
// ============================================

async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validate inputs
    const validation = validateLoginInputs(username, password);
    if (!validation.valid) {
        showMessage('error', validation.message);
        return;
    }

    try {
        // Disable button and show loading
        setLoginButtonState(true);
        showMessage('loading', 'جاري التحقق...');

        // Call API
        const data = await authAPI.login(username, password);

        if (data.success) {
            currentEmployee = data.employee;
            showMessage('success', 'تم تسجيل الدخول بنجاح!');
            
            // Navigate to welcome page
            setTimeout(() => {
                showWelcomePage(data.employee);
            }, 1000);
        } else {
            showMessage('error', data.message || 'فشل تسجيل الدخول!');
            setLoginButtonState(false);
        }

    } catch (error) {
        console.error('Login Error:', error);
        showMessage('error', error.message || 'حدث خطأ في الاتصال بالخادم. تأكد من تشغيل السيرفر!');
        setLoginButtonState(false);
    }
}

// ============================================
// Navigation Functions
// ============================================

function showWelcomePage(employee) {
    const app = document.getElementById('app');
    app.innerHTML = createWelcomePage(employee);
    setupWelcomeListeners(handleLogout);
}

function showLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = createLoginPage();
    setupLoginListeners(handleLogin);
}

// ============================================
// Logout Handler
// ============================================

function handleLogout() {
    currentEmployee = null;
    clearLoginForm();
    hideAllMessages();
    setLoginButtonState(false);
    showLoginPage();
}

// ============================================
// Start Application
// ============================================

document.addEventListener('DOMContentLoaded', initApp);