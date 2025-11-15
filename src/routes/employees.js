// في routes/employees.js أو routes/candidates.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs'); // for password hashing

// 🔥 POST - Add new employee
router.post('/employees', async (req, res) => {
  try {
    const { username, password, fullName, email, position, phone } = req.body;

    // Validate required fields
    if (!username || !password || !fullName || !email || !position) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if username already exists
    const [existingUser] = await db.query(
      'SELECT id FROM employees WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const [existingEmail] = await db.query(
      'SELECT id FROM employees WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password (optional but recommended)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new employee
    const [result] = await db.query(
      'INSERT INTO employees (username, password, fullName, email, position, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, fullName, email, position, phone || null, 'employee']
    );

    res.json({
      success: true,
      message: 'Employee added successfully',
      employeeId: result.insertId
    });

  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee'
    });
  }
});

// 🔥 GET - Get all employees
router.get('/employees', async (req, res) => {
  try {
    const [employees] = await db.query(
      'SELECT id, username, fullName, email, position, phone, role, created_at FROM employees ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get employees'
    });
  }
});

// 🔥 DELETE - Delete employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);

    // Delete assignments first
    await db.query('DELETE FROM assignments WHERE employeeId = ?', [employeeId]);

    // Delete employee
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [employeeId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
});

module.exports = router;
