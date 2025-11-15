// ============================================
// Auth Controller
// ============================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================
// Login Controller
// ============================================

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find employee by username
        const employee = await prisma.employee.findUnique({
            where: { username }
        });

        if (!employee) {
            return res.status(401).json({ 
                success: false, 
                message: 'اسم المستخدم غير صحيح' 
            });
        }

        // Verify password
        // NOTE: In production, use bcrypt for password comparison
        if (employee.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: 'كلمة المرور غير صحيحة' 
            });
        }

        // Successful login
        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            employee: {
                id: employee.id,
                username: employee.username,
                fullName: employee.fullName,
                email: employee.email,
                position: employee.position
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ في الخادم' 
        });
    }
};

// ============================================
// Get All Employees (For Testing)
// ============================================

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                position: true,
                createdAt: true
            }
        });

        res.json({ 
            success: true, 
            employees 
        });

    } catch (error) {
        console.error('Get Employees Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ' 
        });
    }
};