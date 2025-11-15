import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import API_URL  from '../../config/api';

function Dashboard({ candidates, employees, assignments, onEmployeeAdded }) {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
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
        // Refresh employees list
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-blue-200/80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-white">📊 Quick Overview</h3>
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
        
        <div className="space-y-3">
          {employees.map(emp => {
            const empAssignments = assignments.filter(a => a.employeeId === emp.id);
            return (
              <div key={emp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-bold text-white">{emp.fullName}</p>
                  <p className="text-sm text-blue-200/70">{emp.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{empAssignments.length}</p>
                  <p className="text-xs text-blue-200/70">Assigned</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-2xl w-full border border-white/20 shadow-2xl">
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

            <form onSubmit={handleAddEmployee} className="space-y-4">
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
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
