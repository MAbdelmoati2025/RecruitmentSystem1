import React, { useState, useEffect } from 'react';
import { Plus, X, Sparkles, TrendingUp, Award } from 'lucide-react';
import API_URL from '../../config/api';

function Dashboard({ candidates, employees, assignments, onEmployeeAdded }) {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [manager, setManager] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    position: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedManager = JSON.parse(sessionStorage.getItem('employee'));
    if (storedManager && storedManager.role === 'manager') {
      setManager(storedManager);
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = [
    { label: 'Total Candidates', value: candidates.length, icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Employees', value: employees.length, icon: '👨‍💼', color: 'from-purple-500 to-pink-500' },
    { label: 'Assigned', value: assignments.length, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { label: 'Pending', value: candidates.length - assignments.length, icon: '⏳', color: 'from-orange-500 to-red-500' },
  ];

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee)
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Employee added successfully!');
        setShowAddEmployeeModal(false);
        setNewEmployee({
          username: '',
          password: '',
          fullName: '',
          email: '',
          position: '',
          phone: ''
        });
        if (onEmployeeAdded) onEmployeeAdded();
      } else {
        setError(data.message || 'Failed to add employee');
      }
    } catch (err) {
      console.error('Add employee error:', err);
      setError('Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="text-yellow-400 animate-pulse" size={32} />
                <h1 className="text-4xl font-black text-white text-left">
                  {getGreeting()}, {manager?.fullName || 'Manager'}
                </h1>
              </div>
              
              <p className="text-xl text-blue-200/90 mb-4 font-bold">
                Welcome to your Recruitment Management System
              </p>
              
              <p className="text-blue-200/70 mb-6 max-w-2xl">
                Manage your team effectively, track candidate assignments, and monitor employee performance all in one place. 
                Let's make today productive! 🚀
              </p>

              {/* Quick Stats Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-2">
                  <TrendingUp className="text-green-300" size={20} />
                  <span className="text-white font-bold">
                    {assignments.length} Active Assignments
                  </span>
                </div>
                <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center gap-2">
                  <Award className="text-purple-300" size={20} />
                  <span className="text-white font-bold">
                    {employees.length} Team Members
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Avatar */}
            
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-blue-200/80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Team Overview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">👥 Team Overview</h3>
            <p className="text-blue-200/70">Monitor your team's workload and performance</p>
          </div>
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
        
        {employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg mb-4">No employees added yet</p>
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Add Your First Employee
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {employees.map(emp => {
              const empAssignments = assignments.filter(a => a.employeeId === emp.id);
              const completedTasks = empAssignments.filter(a => a.status === 'completed').length;
              const pendingTasks = empAssignments.filter(a => a.status === 'pending').length;
              
              return (
                <div key={emp.id} className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <p className="font-black text-white text-lg">{emp.fullName}</p>
                      <p className="text-sm text-blue-200/70">{emp.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">{empAssignments.length}</p>
                      <p className="text-xs text-blue-200/70">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-400">{completedTasks}</p>
                      <p className="text-xs text-green-200/70">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-yellow-400">{pendingTasks}</p>
                      <p className="text-xs text-yellow-200/70">Pending</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed -inset-10 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-2xl w-full border border-white/20 shadow-2xl ">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white">➕ Add New Employee</h3>
              <button
                onClick={() => {
                  setShowAddEmployeeModal(false);
                  setError('');
                }}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.fullName}
                    onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., HR Specialist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <p className="text-white text-sm font-bold">❌ {error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEmployeeModal(false);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;