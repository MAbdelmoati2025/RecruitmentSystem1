import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from './Sidebar/EmployeeSidebar';
import ProfileCard from './Dashboard/ProfileCard';
import EmployeeStats from './Dashboard/EmployeeStats';
import AssignmentsFilters from './Assignments/AssignmentsFilters';
import AssignmentsTable from './Assignments/AssignmentsTable';
import EditCandidateModal from './Assignments/EditCandidateModal';
import CallLogsView from './CallLogs/CallLogsView';
import API_URL from '../../config/api';

const EmployeeDashboard = ({ user, onLogout }) => { // استقبل user و onLogout كـ props
  const navigate = useNavigate();
  const employee = user; // استخدم user اللي جاي من props

  const [activeView, setActiveView] = useState('dashboard');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    if (!employee) {
      navigate('/login');
      return;
    }
    fetchAssignments();
  }, [employee, navigate]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/assignments/employee/${employee.id}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      alert('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAssignments(prev =>
          prev.map(a => a.id === assignmentId ? { ...a, status: newStatus } : a)
        );
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Position', 'Location', 'Status', 'Assigned Date'],
      ...filteredAssignments.map(a => [
        a.candidate.name,
        a.candidate.email,
        a.candidate.phone,
        a.candidate.position,
        a.candidate.location || '',
        a.status,
        new Date(a.assignedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-assignments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout(); // استخدم الـ onLogout اللي جاي من props
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const candidate = assignment.candidate;
    const matchesSearch = !searchQuery || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone.includes(searchQuery) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <EmployeeSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        employeeName={employee?.name}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <>
              <ProfileCard employee={employee} assignments={assignments} />
              <EmployeeStats assignments={assignments} />
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-600 font-medium mb-1">Recent Activity</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {assignments.filter(a => {
                        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                        return new Date(a.assignedAt) >= dayAgo;
                      }).length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">New assignments in last 24h</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium mb-1">This Week</p>
                    <p className="text-2xl font-bold text-green-900">
                      {assignments.filter(a => {
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return new Date(a.assignedAt) >= weekAgo;
                      }).length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Assignments this week</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Assignments View */}
          {activeView === 'assignments' && (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Assignments</h1>
                <p className="text-gray-600">Manage your assigned candidates</p>
              </div>

              <AssignmentsFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onRefresh={fetchAssignments}
                onExport={handleExport}
              />

              <AssignmentsTable
                assignments={filteredAssignments}
                onEdit={setSelectedAssignment}
                onUpdateStatus={handleUpdateStatus}
              />
            </>
          )}

          {/* Call Logs View */}
          {activeView === 'call-logs' && (
            <CallLogsView employeeId={employee.id} />
          )}

          {/* Other Views */}
          {activeView === 'reports' && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reports Coming Soon</h2>
              <p className="text-gray-600">Performance reports and analytics will be available here</p>
            </div>
          )}

          {activeView === 'notifications' && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Notifications Coming Soon</h2>
              <p className="text-gray-600">Stay updated with system notifications</p>
            </div>
          )}

          {activeView === 'profile' && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Settings Coming Soon</h2>
              <p className="text-gray-600">Update your profile information here</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedAssignment && (
        <EditCandidateModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onSave={fetchAssignments}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
