import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { sendPasswordResetEmail, testEmailConnection } from './server/src/services/emailService.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// ============ Login API ============
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter username and password' 
      });
    }

    let user = await prisma.manager.findUnique({
      where: { username }
    });

    let role = 'manager';

    if (!user) {
      user = await prisma.employee.findUnique({
        where: { username }
      });
      role = 'employee';
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        position: user.position,
        phone: user.phone,
        role: role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ============ Managers APIs ============
app.get('/api/managers', async (req, res) => {
  try {
    const managers = await prisma.manager.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        position: true,
        createdAt: true
      }
    });
    res.json({ success: true, managers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
});

// ============ Employees APIs ============
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        position: true,
        phone: true,
        createdAt: true
      }
    });
    res.json({ success: true, employees });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { username, password, fullName, email, position, phone } = req.body;

    if (!username || !password || !fullName || !email || !position) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingUser = await prisma.employee.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        username,
        password,
        fullName,
        email,
        position,
        phone
      }
    });

    res.json({
      success: true,
      message: 'Employee added successfully',
      employeeId: newEmployee.id
    });

  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee'
    });
  }
});

// ============ Candidates APIs ============
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, candidates });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
});

app.post('/api/candidates/bulk', async (req, res) => {
  try {
    const { candidates } = req.body;

    if (!candidates || !Array.isArray(candidates)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid data' 
      });
    }

    const uploadBatch = new Date().toISOString();

    const createdCandidates = await prisma.candidate.createMany({
      data: candidates.map(c => ({
        name: c.name,
        phone: c.phone,
        age: c.age,
        address: c.address,
        company: c.company,
        position: c.position,
        education: c.education,
        uploadBatch: uploadBatch
      })),
      skipDuplicates: true
    });

    res.json({
      success: true,
      message: `${createdCandidates.count} candidates added successfully`,
      count: createdCandidates.count
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

app.patch('/api/candidates/:id', async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);
    const { name, phone, age, address, company, position, education } = req.body;

    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        name,
        phone,
        age,
        address,
        company,
        position,
        education,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate: updatedCandidate
    });

  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate'
    });
  }
});

// Delete all candidates - MUST BE FIRST
app.delete('/api/candidates/all', async (req, res) => {
  try {
    console.log('🗑️ Deleting all candidates...');

    await prisma.assignment.deleteMany({});
    console.log('✅ Deleted all assignments');

    await prisma.candidate.deleteMany({});
    console.log('✅ Deleted all candidates');

    res.json({
      success: true,
      message: 'All candidates deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete all candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all candidates',
      error: error.message
    });
  }
});

// Delete single candidate
app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);
    
    if (isNaN(candidateId) || candidateId <= 0) {
      console.log('❌ Invalid candidate ID received:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID'
      });
    }

    console.log('🗑️ Deleting candidate:', candidateId);

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    await prisma.assignment.deleteMany({
      where: { candidateId: candidateId }
    });

    await prisma.candidate.delete({
      where: { id: candidateId }
    });

    console.log('✅ Candidate deleted successfully');

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete candidate',
      error: error.message
    });
  }
});

// ============ Assignments APIs ============
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        employee: true,
        candidate: true
      },
      orderBy: { assignedAt: 'desc' }
    });
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
});

app.get('/api/assignments/employee/:employeeId', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    console.log('📥 Getting assignments for employee:', employeeId);

    const assignments = await prisma.assignment.findMany({
      where: { employeeId },
      include: {
        candidate: true
      },
      orderBy: { assignedAt: 'desc' }
    });

    console.log('✅ Found assignments:', assignments.length);
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('❌ Get assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred',
      error: error.message 
    });
  }
});

app.post('/api/assignments/bulk', async (req, res) => {
  try {
    const { assignments, managerId, managerName } = req.body;
    console.log('📥 Received assignments with managerId:', managerId);

    if (!assignments || !Array.isArray(assignments)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid data' 
      });
    }

    const createdAssignments = await prisma.assignment.createMany({
      data: assignments.map(a => ({
        employeeId: a.employeeId,
        candidateId: a.candidateId,
        managerId: managerId || null,
        status: a.status || 'pending',
        notes: a.notes || null
      })),
      skipDuplicates: true
    });

    const employeeAssignments = assignments.reduce((acc, curr) => {
      acc[curr.employeeId] = (acc[curr.employeeId] || 0) + 1;
      return acc;
    }, {});

    for (const employeeId of Object.keys(employeeAssignments)) {
      await prisma.notification.deleteMany({
        where: {
          employeeId: parseInt(employeeId),
          type: 'assignment',
          read: false
        }
      });
    }

    const notifications = Object.entries(employeeAssignments).map(([employeeId, count]) => ({
      employeeId: parseInt(employeeId),
      type: 'assignment',
      message: `Manager ${managerName || 'System'} assigned you ${count} new ${count === 1 ? 'client' : 'clients'}`,
      read: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    console.log('✅ Created assignments:', createdAssignments.count);
    console.log('✅ Created notifications:', notifications.length);

    res.json({
      success: true,
      message: 'Saved successfully',
      count: createdAssignments.count
    });

  } catch (error) {
    console.error('❌ Assignment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred',
      error: error.message 
    });
  }
});

// 🔥 ASSIGNMENT UPDATE - SENDS NOTIFICATION TO ALL MANAGERS
app.patch('/api/assignments/:id', async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const { status, notes, employeeName, candidateName } = req.body;

    console.log('📥 Assignment update request:', { assignmentId, status, employeeName, candidateName });

    const currentAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        employee: true,
        candidate: true,
        manager: true
      }
    });

    if (!currentAssignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        status,
        notes,
        completedAt: status === 'completed' ? new Date() : null
      }
    });

    console.log('✅ Assignment updated:', updatedAssignment);

    // 🔥 إذا تم إكمال المهمة، إرسال إشعار لكل المانجرز
    if (status === 'completed' && currentAssignment.status !== 'completed') {
      
      console.log('🔥 Task completed! Creating notifications for all managers...');
      
      const startTime = currentAssignment.assignedAt;
      const endTime = new Date();
      
      const allManagers = await prisma.manager.findMany();
      
      console.log('📋 Found managers:', allManagers.length);
      
      if (allManagers.length === 0) {
        console.log('⚠️ No managers found in system!');
        return res.json({
          success: true,
          message: 'Assignment updated but no managers to notify',
          assignment: updatedAssignment
        });
      }
      
      const notifications = allManagers.map(manager => ({
        managerId: manager.id,
        type: 'task_completed',
        message: `✅ ${employeeName || currentAssignment.employee.fullName} completed the task for ${candidateName || currentAssignment.candidate.name}`,
        read: false,
        metadata: JSON.stringify({
          employeeName: employeeName || currentAssignment.employee.fullName,
          employeeId: currentAssignment.employeeId,
          candidateName: candidateName || currentAssignment.candidate.name,
          candidateId: currentAssignment.candidateId,
          assignmentId: assignmentId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: notes || null
        })
      }));

      const createdNotifications = await prisma.managerNotification.createMany({
        data: notifications
      });

      console.log('✅ Manager notifications created:', createdNotifications.count);
    }

    res.json({
      success: true,
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });

  } catch (error) {
    console.error('❌ Update assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message
    });
  }
});

// ============ Notifications APIs ============

// جلب إشعارات موظف
app.get('/api/notifications/employee/:employeeId', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    
    const notifications = await prisma.notification.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred' 
    });
  }
});

// جلب إشعارات مدير
app.get('/api/notifications/manager/:managerId', async (req, res) => {
  try {
    const managerId = parseInt(req.params.managerId);
    
    const notifications = await prisma.managerNotification.findMany({
      where: { managerId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Get manager notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred' 
    });
  }
});

// تحديد إشعار كمقروء
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    
    try {
      const employeeNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      });
      return res.json({ success: true, notification: employeeNotification });
    } catch (e) {
      const managerNotification = await prisma.managerNotification.update({
        where: { id: notificationId },
        data: { read: true }
      });
      return res.json({ success: true, notification: managerNotification });
    }
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred' 
    });
  }
});

// تحديد جميع إشعارات موظف كمقروءة
app.patch('/api/notifications/employee/:employeeId/read-all', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    
    await prisma.notification.updateMany({
      where: { 
        employeeId,
        read: false 
      },
      data: { read: true }
    });

    res.json({ 
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred' 
    });
  }
});

// تحديد جميع إشعارات مدير كمقروءة
app.patch('/api/notifications/manager/:managerId/read-all', async (req, res) => {
  try {
    const managerId = parseInt(req.params.managerId);
    
    const result = await prisma.managerNotification.updateMany({
      where: { 
        managerId,
        read: false 
      },
      data: { read: true }
    });

    console.log('✅ Marked as read:', result.count);

    res.json({ 
      success: true,
      message: 'All manager notifications marked as read',
      count: result.count
    });
  } catch (error) {
    console.error('Mark all manager notifications as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred' 
    });
  }
});

// حذف إشعار
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    
    try {
      await prisma.notification.delete({
        where: { id: notificationId }
      });
      return res.json({ success: true, message: 'Notification deleted' });
    } catch (e) {
      await prisma.managerNotification.delete({
        where: { id: notificationId }
      });
      return res.json({ success: true, message: 'Manager notification deleted' });
    }
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error occurred' 
    });
  }
});

// 🔥 NEW: Clear ALL manager notifications
app.delete('/api/notifications/manager/:managerId/clear-all', async (req, res) => {
  try {
    const managerId = parseInt(req.params.managerId);
    
    console.log('🗑️ Clearing all notifications for manager:', managerId);
    
    const result = await prisma.managerNotification.deleteMany({
      where: { managerId }
    });

    console.log('✅ Deleted notifications:', result.count);

    res.json({
      success: true,
      message: `Cleared ${result.count} notifications successfully`,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('❌ Clear all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear notifications',
      error: error.message
    });
  }
});
// Add these endpoints to your server.js file

// Store reset codes temporarily (in production, use Redis or database)
const resetCodes = new Map();

// Helper function to generate 6-digit code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Test email connection on server start
testEmailConnection();

// ============ Password Reset APIs ============

// Step 1: Request password reset
app.post('/api/password-reset/request', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    console.log(`🔍 Password reset request for username: ${username}`);

    // Check in managers first
    let user = await prisma.manager.findUnique({
      where: { username },
      select: { id: true, username: true, email: true, fullName: true }
    });

    let userType = 'manager';

    // If not found, check in employees
    if (!user) {
      user = await prisma.employee.findUnique({
        where: { username },
        select: { id: true, username: true, email: true, fullName: true }
      });
      userType = 'employee';
    }

    if (!user) {
      console.log(`❌ User not found: ${username}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.email) {
      console.log(`❌ No email for user: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'No email associated with this account. Please contact your administrator.'
      });
    }

    // Generate 6-digit reset code
    const resetCode = generateResetCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store reset code
    resetCodes.set(username, {
      code: resetCode,
      expiresAt: expiresAt,
      userType: userType,
      userId: user.id
    });

    console.log(`🔐 Reset code generated for ${username}: ${resetCode} (expires in 15 minutes)`);

    // Send email with reset code
    try {
      await sendPasswordResetEmail(
        user.email,
        user.fullName,
        resetCode,
        username
      );

      // Mask email for security
      const maskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

      console.log(`✅ Reset email sent successfully to: ${maskedEmail}`);

      res.json({
        success: true,
        message: 'Reset code sent to your email',
        email: maskedEmail
      });

    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      
      // Remove the reset code if email fails
      resetCodes.delete(username);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please check your email configuration or try again later.'
      });
    }

  } catch (error) {
    console.error('❌ Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Step 2: Verify reset code
app.post('/api/password-reset/verify', async (req, res) => {
  try {
    const { username, code } = req.body;

    if (!username || !code) {
      return res.status(400).json({
        success: false,
        message: 'Username and code are required'
      });
    }

    console.log(`🔍 Verifying reset code for: ${username}`);

    const resetData = resetCodes.get(username);

    if (!resetData) {
      console.log(`❌ No reset request found for: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'No reset request found for this user'
      });
    }

    // Check if code expired
    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(username);
      console.log(`⏰ Reset code expired for: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.'
      });
    }

    // Verify code
    if (resetData.code !== code) {
      console.log(`❌ Invalid reset code for: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    console.log(`✅ Reset code verified for: ${username}`);

    res.json({
      success: true,
      message: 'Code verified successfully'
    });

  } catch (error) {
    console.error('❌ Verify reset code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Step 3: Reset password
app.post('/api/password-reset/reset', async (req, res) => {
  try {
    const { username, code, newPassword } = req.body;

    if (!username || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    console.log(`🔄 Password reset attempt for: ${username}`);

    const resetData = resetCodes.get(username);

    if (!resetData) {
      console.log(`❌ No reset request found for: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'No reset request found'
      });
    }

    // Check if code expired
    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(username);
      console.log(`⏰ Reset code expired for: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired'
      });
    }

    // Verify code one more time
    if (resetData.code !== code) {
      console.log(`❌ Invalid reset code for: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    // Update password based on user type
    if (resetData.userType === 'manager') {
      await prisma.manager.update({
        where: { id: resetData.userId },
        data: { password: newPassword }
      });
      console.log(`✅ Manager password updated: ${username}`);
    } else {
      await prisma.employee.update({
        where: { id: resetData.userId },
        data: { password: newPassword }
      });
      console.log(`✅ Employee password updated: ${username}`);
    }

    // Remove used reset code
    resetCodes.delete(username);

    console.log(`✅ Password reset successful for: ${username}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Optional: Clean up expired codes periodically (run every hour)
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [username, data] of resetCodes.entries()) {
    if (now > data.expiresAt) {
      resetCodes.delete(username);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🗑️ Cleaned up ${cleanedCount} expired reset code(s)`);
  }
}, 60 * 60 * 1000); // Every hour

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Login page: http://localhost:${PORT}`);
});