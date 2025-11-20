import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import UploadCandidates from './Candidates/UploadCandidates';
import AllCandidates from './Candidates/AllCandidates';
import AllCandidate from './Candidates/history';

import EmployeesAssignments from './Employees/EmployeesAssignments';
import SummaryReport from './Reports/SummaryReport';
import Report from './Reports/ReportsPage';
import ManagerNotifications from './Notifications/ManagerNotifications'; // 🔥 NEW
import WhatsAppExtension from './Candidates/WhatsAppExtension';
import API_URL from '../config/api';

function RecruitmentSystem() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [manager, setManager] = useState(null);

  // 🔥 إضافة state للإشعارات
  const [notifications, setNotifications] = useState([]);

  const [filters, setFilters] = useState({
    age: '',
    address: '',
    company: '',
    position: '',
    education: ''
  });

  useEffect(() => {
    loadStoredData();

    const storedManager = JSON.parse(sessionStorage.getItem('employee'));
    if (storedManager && storedManager.role === 'manager') {
      setManager(storedManager);
      loadManagerNotifications(storedManager.id); // 🔥 تحميل إشعارات المدير
    }
  }, []);

  // 🔥 تحميل إشعارات المدير
  const loadManagerNotifications = async (managerId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/manager/${managerId}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Load manager notifications error:', error);
    }
  };

  // 🔥 تحديد إشعار كمقروء
  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });

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
      await fetch(`${API_URL}/notifications/manager/${manager.id}/read-all`, {
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

  const loadStoredData = async () => {
    try {
      const candidatesRes = await fetch(`${API_URL}/candidates`);
      if (candidatesRes.ok) {
        const data = await candidatesRes.json();
        setCandidates(data.candidates || []);
      }

      const employeesRes = await fetch(`${API_URL}/employees`);
      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data.employees || []);
      }

      const assignmentsRes = await fetch(`${API_URL}/assignments`);
      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('employee');
    window.location.href = '/';
  };

  const handleDeleteCandidate = (candidateId) => {
    if (candidateId === 'all') {
      setCandidates([]);
      loadStoredData();
    } else {
      const id = parseInt(candidateId);
      setCandidates(prev => prev.filter(c => c.id !== id));
      loadStoredData();
    }
  };

  const handleAssign = async (newAssignments) => {
    try {
      const response = await fetch(`${API_URL}/assignments/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignments: newAssignments,
          managerId: manager?.id,
          managerName: manager?.fullName
        })
      });

      const data = await response.json();

      if (data.success) {
        setAssignments([...assignments, ...newAssignments]);
        loadStoredData();
      }
    } catch (error) {
      console.error('Assignment error:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard candidates={candidates} employees={employees} assignments={assignments} />;

      case 'upload':
        return <UploadCandidates onUpload={() => loadStoredData()} />;

      case 'candidates':
        return (
          <AllCandidates
            candidates={candidates}
            filters={filters}
            setFilters={setFilters}
            onDelete={handleDeleteCandidate}
            employees={employees}
            assignments={assignments}
            onAssign={handleAssign}
          />
        );
      case 'candidate':
        return (
          <AllCandidate
            candidates={candidates}
            filters={filters}
            setFilters={setFilters}
            onDelete={handleDeleteCandidate}
            employees={employees}
            assignments={assignments}
            onAssign={handleAssign}
          />
        );

      case 'employees':
        return (
          <EmployeesAssignments
            employees={employees}
            candidates={candidates}
            assignments={assignments}
            onAssign={handleAssign}
          />
        );

      case 'summary':
        return <SummaryReport employees={employees} assignments={assignments} />;

      case 'Report':
        return <Report employees={employees} assignments={assignments} />;

      case 'notifications':
        return (
          <ManagerNotifications
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteNotification}
          />
        );
      case 'whatsapp':
        return <WhatsAppExtension />;

      default:
        return <Dashboard candidates={candidates} employees={employees} assignments={assignments} />;
    }
  };

  // 🔥 حساب عدد الإشعارات غير المقروءة
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        candidatesCount={candidates.length}
        unreadNotifications={unreadNotifications} // 🔥 تمرير عدد الإشعارات
      />

      <div className="ml-64 flex-1 flex flex-col">
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-6 -mt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'upload' && '📤 Upload Candidates'}
              {currentPage === 'candidates' && '👥 All Candidates'}
              {currentPage === 'employees' && '👨‍💼 Employees & Assignments'}
              {currentPage === 'summary' && '📊 Summary Report'}
              {currentPage === 'Report' && '📊 Report'}
              {currentPage === 'notifications' && '🔔 Notifications'} {/* 🔥 NEW */}
              {currentPage === 'whatsapp' && '💬 WhatsApp Extension'}
            </h2>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default RecruitmentSystem;