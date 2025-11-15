// ============================================
// API Service
// ============================================

const API_URL = 'http://localhost:3000/api';

export const authAPI = {
    /**
     * Login user
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Login API Error:', error);
            throw new Error('حدث خطأ في الاتصال بالخادم');
        }
    },

    /**
     * Get all employees (for testing)
     * @returns {Promise<Object>}
     */
    async getAllEmployees() {
        try {
            const response = await fetch(`${API_URL}/employees`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get Employees API Error:', error);
            throw new Error('حدث خطأ في الاتصال بالخادم');
        }
    }
};