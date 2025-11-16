import { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  TrendingUp,
  Edit,
  Save,
  X,
  Home,
  ClipboardList,
  Bell,
  LogOut,
  MessageCircle,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  Globe,
  FileText,
  Eye,
  Package
} from 'lucide-react';
import API_URL from '../config/api';
import IconImage from '../photos/icon10.png';

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
  const [notifications] = useState([
    { id: 1, type: 'assignment', message: 'New candidate assigned to you', time: '2 hours ago', read: false },
    { id: 2, type: 'update', message: 'Candidate status updated', time: '5 hours ago', read: false },
    { id: 3, type: 'reminder', message: 'Follow up with 3 candidates', time: '1 day ago', read: true }
  ]);

  useEffect(() => {
    const storedEmployee = JSON.parse(sessionStorage.getItem('employee'));
    if (storedEmployee) {
      setEmployee(storedEmployee);
      loadAssignments(storedEmployee.id);
    }
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, statusFilter]);

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
      const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
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
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={IconImage}
              alt="Logo"
              className="w-12 h-12 object-cover rounded-full shadow-xl"
            />
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{employee?.fullName}</h3>
              <p className="text-blue-200/60 text-xs">{employee?.position}</p>
            </div>
          </div>

          {/* Quick Stats in Sidebar */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-blue-200/60 text-xs mb-1">Total Tasks</p>
              <p className="text-white font-black text-xl">{stats.total}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-blue-200/60 text-xs mb-1">Completed</p>
              <p className="text-green-400 font-black text-xl">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Home size={20} />
            <span className="font-bold text-sm">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('assignments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'assignments'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
              }`}
          >
            <ClipboardList size={20} />
            <span className="font-bold text-sm">My Assignments</span>
            {stats.pending > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'notifications'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Bell size={20} />
            <span className="font-bold text-sm">Notifications</span>
            {unreadNotifications > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'profile'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
              }`}
          >
            <User size={20} />
            <span className="font-bold text-sm">My Profile</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">
                  Welcome back 👋
                   {/* {employee?.fullName}!  */}
                </h1>
                <p className="text-blue-200/70">Here's your performance overview</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                    <Package size={20} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stats.total}</h3>
                  <p className="text-sm text-blue-200/80">Total Assigned</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3">
                    <Clock size={20} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stats.pending}</h3>
                  <p className="text-sm text-blue-200/80">Pending</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-3">
                    <AlertCircle size={20} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stats.inProgress}</h3>
                  <p className="text-sm text-blue-200/80">In Progress</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stats.completed}</h3>
                  <p className="text-sm text-blue-200/80">Completed</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stats.completionRate}%</h3>
                  <p className="text-sm text-white/80">Success Rate</p>
                </div>
              </div>

              {/* Recent Assignments Preview */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-white">Recent Assignments</h2>
                  <button
                    onClick={() => setActiveView('assignments')}
                    className="text-blue-300 text-sm font-bold hover:text-blue-200 transition-colors"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{assignment.candidate?.name}</p>
                          <p className="text-blue-200/60 text-xs">{assignment.candidate?.position}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.status === 'completed'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                        : assignment.status === 'in_progress'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                        }`}>
                        {assignment.status === 'pending' && 'Pending'}
                        {assignment.status === 'in_progress' && 'In Progress'}
                        {assignment.status === 'completed' && 'Completed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assignments View */}
          {activeView === 'assignments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">My Assignments</h1>
                <p className="text-blue-200/70">Manage and track your candidate assignments</p>
              </div>

              {/* Filters */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search by name, phone, email, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Assignments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssignments.length === 0 ? (
                  <div className="col-span-full bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/20">
                    <ClipboardList size={48} className="text-white/30 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">No assignments found</p>
                  </div>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                            <User size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold">{assignment.candidate?.name}</h3>
                            <p className="text-blue-200/60 text-xs">{assignment.candidate?.position || 'N/A'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${assignment.status === 'completed'
                          ? 'bg-green-500/20 text-green-300'
                          : assignment.status === 'in_progress'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-orange-500/20 text-orange-300'
                          }`}>
                          {assignment.status === 'pending' && '⏳'}
                          {assignment.status === 'in_progress' && '🔄'}
                          {assignment.status === 'completed' && '✅'}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-blue-200/80">
                          <Phone size={14} />
                          <span>{assignment.candidate?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-200/80">
                          <Mail size={14} />
                          <span className="truncate">{assignment.candidate?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-200/80">
                          <Building size={14} />
                          <span>{assignment.candidate?.company || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetailsModal(assignment)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                        {assignment.candidate?.phone && (
                          <button
                            onClick={() => openWhatsApp(assignment.candidate.phone)}
                            className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1"
                          >
                            <MessageCircle size={14} />
                          </button>
                        )}
                      </div>

                      {/* Status Actions */}
                      <div className="mt-3 flex gap-2">
                        {assignment.status === 'pending' && (
                          <button
                            onClick={() => updateAssignmentStatus(assignment.id, 'in_progress')}
                            className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 rounded-lg text-xs font-bold hover:bg-yellow-500/30 transition-all"
                          >
                            Start Working
                          </button>
                        )}
                        {assignment.status === 'in_progress' && (
                          <button
                            onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                            className="flex-1 px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/50 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-all"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notifications View */}
          {activeView === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">Notifications</h1>
                <p className="text-blue-200/70">Stay updated with your latest activities</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Bell size={48} className="text-white/30 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-blue-500/10' : ''
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'assignment'
                            ? 'bg-blue-500/20'
                            : notification.type === 'update'
                              ? 'bg-green-500/20'
                              : 'bg-orange-500/20'
                            }`}>
                            {notification.type === 'assignment' && <ClipboardList size={20} className="text-blue-300" />}
                            {notification.type === 'update' && <CheckCircle size={20} className="text-green-300" />}
                            {notification.type === 'reminder' && <Bell size={20} className="text-orange-300" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-bold mb-1">{notification.message}</p>
                            <p className="text-blue-200/60 text-sm
                            ">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile View */}
          {activeView === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">My Profile</h1>
                <p className="text-blue-200/70">View and manage your account information</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">{employee?.fullName}</h2>
                    <p className="text-blue-200/70 mb-2">{employee?.position || 'Employee'}</p>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold border border-green-500/50">
                      Active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Mail size={20} className="text-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/70">Email Address</p>
                        <p className="text-white font-bold">{employee?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Phone size={20} className="text-orange-300" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/70">Phone Number</p>
                        <p className="text-white font-bold">{employee?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} className="text-green-300" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/70">Position</p>
                        <p className="text-white font-bold">{employee?.position || 'Employee'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="p-6 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Calendar size={20} className="text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/70">Member Since</p>
                        <p className="text-white font-bold">
                          {employee?.createdAt
                            ? new Date(employee.createdAt).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-black text-white mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-black text-white mb-1">{stats.total}</p>
                      <p className="text-xs text-blue-200/70">Total Tasks</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-black text-green-400 mb-1">{stats.completed}</p>
                      <p className="text-xs text-blue-200/70">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-black text-yellow-400 mb-1">{stats.inProgress}</p>
                      <p className="text-xs text-blue-200/70">In Progress</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-black text-purple-400 mb-1">{stats.completionRate}%</p>
                      <p className="text-xs text-blue-200/70">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Details/Edit Modal */}
      {showDetailsModal && selectedAssignment && editedCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 
                max-w-3xl w-full border border-white/20 shadow-2xl 
                my-8 mt-[550px]">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {editMode ? 'Edit Candidate Information' : 'Candidate Details'}
                  </h3>
                  <p className="text-blue-200/60 text-sm">
                    {editMode ? 'Update candidate information and add notes' : 'View complete candidate profile'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setEditMode(false);
                  setCallNotes('');
                }}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Status and Actions Bar */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-200/70">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedAssignment.status === 'completed'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : selectedAssignment.status === 'in_progress'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                    }`}>
                    {selectedAssignment.status === 'pending' && '⏳ Pending'}
                    {selectedAssignment.status === 'in_progress' && '🔄 In Progress'}
                    {selectedAssignment.status === 'completed' && '✅ Completed'}
                  </span>
                </div>

                {!editMode && (
                  <div className="flex gap-2">
                    {selectedAssignment.candidate?.phone && (
                      <button
                        onClick={() => openWhatsApp(selectedAssignment.candidate.phone)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </button>
                    )}
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Info
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <User size={18} />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <User size={14} />
                      Full Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.name}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.name || 'N/A'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Mail size={14} />
                      Email Address
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        value={editedCandidate.email || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold break-all">{selectedAssignment.candidate?.email || 'N/A'}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Phone size={14} />
                      Phone Number
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.phone}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.phone || 'N/A'}</p>
                    )}
                  </div>

                  {/* Age */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Calendar size={14} />
                      Age
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        value={editedCandidate.age || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, age: parseInt(e.target.value) || null })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.age || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Briefcase size={18} />
                  Professional Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Building size={14} />
                      Company
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.company || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, company: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.company || 'N/A'}</p>
                    )}
                  </div>

                  {/* Position */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Briefcase size={14} />
                      Position
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.position || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, position: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.position || 'N/A'}</p>
                    )}
                  </div>

                  {/* Education */}
                  <div className="p-4 bg-white/5 rounded-xl md:col-span-2">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <GraduationCap size={14} />
                      Education
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.education || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, education: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g., Bachelor's in Computer Science"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.education || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <MapPin size={18} />
                  Location Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address */}
                  <div className="p-4 bg-white/5 rounded-xl md:col-span-2">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <MapPin size={14} />
                      Address
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.address || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, address: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="Full address"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.address || 'N/A'}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Globe size={14} />
                      City
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.city || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, city: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.city || 'N/A'}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-xs text-blue-200/70 mb-2 block flex items-center gap-2">
                      <Globe size={14} />
                      Country
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedCandidate.country || ''}
                        onChange={(e) => setEditedCandidate({ ...editedCandidate, country: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-white font-bold">{selectedAssignment.candidate?.country || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Call Notes - Only in Edit Mode */}
              {editMode && (
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
                  <label className="text-sm font-bold text-white mb-3 block flex items-center gap-2">
                    <FileText size={18} />
                    Call Notes & Additional Information
                  </label>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Add notes from your conversation with the candidate..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-blue-200/60 mt-2">
                    These notes will be saved to the call log history
                  </p>
                </div>
              )}

              {/* Assignment Info */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-sm font-bold text-white mb-3">Assignment Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-200/60 mb-1">Assigned Date</p>
                    <p className="text-white font-bold">
                      {selectedAssignment.assignedAt
                        ? new Date(selectedAssignment.assignedAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200/60 mb-1">Assignment ID</p>
                    <p className="text-white font-bold">#{selectedAssignment.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditedCandidate({ ...selectedAssignment.candidate });
                      setCallNotes('');
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCandidate}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save All Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
