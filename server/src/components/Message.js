// ============================================
// Message Component
// ============================================

export function showMessage(type, text) {
    const messages = {
        error: 'errorMsg',
        success: 'successMsg',
        loading: 'loadingMsg'
    };

    // Hide all messages first
    Object.values(messages).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Show the selected message
    const messageId = messages[type];
    if (messageId) {
        const msgElement = document.getElementById(messageId);
        if (msgElement) {
            msgElement.textContent = text;
            msgElement.style.display = 'block';
        }
    }
}

export function hideAllMessages() {
    const messageIds = ['errorMsg', 'successMsg', 'loadingMsg'];
    messageIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}