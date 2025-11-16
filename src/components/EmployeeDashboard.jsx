import { useState, useEffect } from 'react';
import API_URL from '../config/api';

// Import Components
import Sidebar from './Sidebar/Sidebar1';
import DashboardView from './Dashboard/DashboardView';
import AssignmentsView from './Assignments/AssignmentsView';
import NotificationsView from './Notifications/NotificationsView';
import ProfileView from './Profile/ProfileView';
import CandidateModal from './Candidate/CandidateModal';

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  
  // 🔥 الإشعارات من الداتابيز
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedEmployee = JSON.parse(sessionStorage.getItem('employee'));
    if (storedEmployee) {
      setEmployee(storedEmployee);
      loadAssignments(storedEmployee.id);
      loadNotifications(storedEmployee.id); // 🔥 تحميل الإشعارات
    }
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, statusFilter]);

  // 🔥 تحميل الإشعارات من الداتابيز
  const loadNotifications = async (employeeId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/employee/${employeeId}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Load notifications error:', error);
    }
  };
  

  // 🔥 تحديد إشعار كمقروء
  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      // تحديث الـ state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  // 🔥 تحديد كل الإشعارات كمقروءة
  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/employee/${employee.id}/read-all`, {
        method: 'PATCH'
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  // 🔥 حذف إشعار
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const loadAssignments = async (employeeId) => {
    try {
      const response = await fetch(`${API_URL}/assignments/employee/${employeeId}`);
      const data = await response.json();

      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error('Load assignments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = [...assignments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.candidate?.phone?.includes(searchTerm) ||
        a.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.candidate?.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  };

const updateAssignmentStatus = async (assignmentId, newStatus) => {
  try {
    const assignment = assignments.find(a => a.id === assignmentId);
    
    const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: newStatus,
        employeeName: employee.fullName, // 🔥 إضافة اسم الموظف
        candidateName: assignment?.candidate?.name // 🔥 إضافة اسم العميل
      })
    });

    const data = await response.json();

    if (data.success) {
      loadAssignments(employee.id);
      alert('✅ Status updated successfully!');
    } else {
      alert('❌ Failed to update status');
    }
  } catch (error) {
    console.error('Update status error:', error);
    alert('❌ Error updating status');
  }
};

  const handleSaveCandidate = async () => {
    if (!editedCandidate) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/candidates/${editedCandidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCandidate)
      });

      const data = await response.json();

      if (data.success) {
        if (callNotes.trim()) {
          await saveCallLog(editedCandidate.id, callNotes);
        }

        loadAssignments(employee.id);
        setEditMode(false);
        setCallNotes('');
        setShowDetailsModal(false);
        alert('✅ Candidate data updated successfully!');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Save candidate error:', error);
      alert('❌ Error saving candidate data');
    } finally {
      setSaving(false);
    }
  };

  const saveCallLog = async (candidateId, notes) => {
    try {
      await fetch(`${API_URL}/call-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          employeeId: employee.id,
          notes,
          status: 'contacted'
        })
      });
    } catch (error) {
      console.error('Save call log error:', error);
    }
  };

  const openDetailsModal = (assignment) => {
    setSelectedAssignment(assignment);
    setEditedCandidate({ ...assignment.candidate });
    setEditMode(false);
    setShowDetailsModal(true);
  };

  const openWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('employee');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-bold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    completionRate: assignments.length > 0
      ? Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)
      : 0
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        employee={employee}
        stats={stats}
        activeView={activeView}
        setActiveView={setActiveView}
        unreadNotifications={unreadNotifications}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <DashboardView
              employee={employee}
              stats={stats}
              assignments={assignments}
              setActiveView={setActiveView}
            />
          )}

          {/* Assignments View */}
          {activeView === 'assignments' && (
            <AssignmentsView
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              filteredAssignments={filteredAssignments}
              openDetailsModal={openDetailsModal}
              openWhatsApp={openWhatsApp}
              updateAssignmentStatus={updateAssignmentStatus}
            />
          )}

          {/* Notifications View */}
          {activeView === 'notifications' && (
            <NotificationsView 
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />
          )}

          {/* Profile View */}
          {activeView === 'profile' && (
            <ProfileView employee={employee} stats={stats} />
          )}
        </div>
      </main>

      {/* Candidate Details/Edit Modal */}
      <CandidateModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedAssignment={selectedAssignment}
        editMode={editMode}
        setEditMode={setEditMode}
        editedCandidate={editedCandidate}
        setEditedCandidate={setEditedCandidate}
        callNotes={callNotes}
        setCallNotes={setCallNotes}
        saving={saving}
        handleSaveCandidate={handleSaveCandidate}
        openWhatsApp={openWhatsApp}
      />
    </div>
  );
}

export default EmployeeDashboard;