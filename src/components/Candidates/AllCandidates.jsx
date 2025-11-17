import React, { useState, useEffect } from 'react';
import { Filter, Trash2, UserPlus, X, Loader2 } from 'lucide-react';
import API_URL from '../../config/api';

function AllCandidates({ candidates, filters, setFilters, onDelete, employees, assignments, onAssign }) {
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignCount, setAssignCount] = useState(10);
  const [assigning, setAssigning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate loading effect with progress
  useEffect(() => {
    if (!loading) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, [loading]);

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    if (filters.age && candidate.age !== parseInt(filters.age)) return false;
    if (filters.address && !candidate.address?.toLowerCase().includes(filters.address.toLowerCase())) return false;
    if (filters.company && !candidate.company?.toLowerCase().includes(filters.company.toLowerCase())) return false;
    if (filters.position && !candidate.position?.toLowerCase().includes(filters.position.toLowerCase())) return false;
    if (filters.education && !candidate.education?.toLowerCase().includes(filters.education.toLowerCase())) return false;
    return true;
  });

  // Unassigned filtered candidates
  const unassignedFilteredCandidates = filteredCandidates.filter(
    c => !assignments.some(a => a.candidateId === c.id)
  );

  const clearFilters = () => {
    setFilters({ age: '', address: '', company: '', position: '', education: '' });
  };

  const handleDeleteCandidate = async (candidateId) => {
    const id = parseInt(candidateId);
    if (!id || isNaN(id)) {
      alert('❌ Invalid candidate ID');
      console.error('Invalid ID:', candidateId);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    try {
      console.log('🗑️ Deleting candidate ID:', id);

      const response = await fetch(`${API_URL}/candidates/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        onDelete(id);
        alert('✅ Candidate deleted successfully');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ An error occurred while deleting');
    }
  };

  const handleDeleteAllCandidates = async () => {
    if (!window.confirm('⚠️ Are you sure you want to delete ALL candidates? This action cannot be undone!')) return;

    try {
      const response = await fetch(`${API_URL}/candidates/all`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        onDelete('all');
        alert('✅ All candidates deleted successfully');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete all error:', error);
      alert('❌ An error occurred while deleting');
    }
  };

  const handleAssignFiltered = async () => {
    if (!selectedEmployee || assignCount === 0) return;

    setAssigning(true);
    try {
      const toAssign = unassignedFilteredCandidates.slice(0, assignCount);
      const newAssignments = toAssign.map(c => ({
        employeeId: selectedEmployee.id,
        candidateId: c.id,
        status: 'pending'
      }));

      const response = await fetch(`${API_URL}/assignments/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments: newAssignments })
      });

      const data = await response.json();

      if (data.success) {
        onAssign(newAssignments);
        setShowAssignModal(false);
        setSelectedEmployee(null);
        setAssignCount(10);
        alert(`✅ Successfully assigned ${data.count} candidates`);
      } else {
        alert(`❌ Error: ${data.message}`);
      }

    } catch (error) {
      console.error('Assignment error:', error);
      alert(`❌ An error occurred: ${error.message}`);
    } finally {
      setAssigning(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden ">
        {/* Animated Background Shapes - Simplified */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Moving Circles */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Floating Squares */}
          <div className="absolute top-10 right-1/4 w-12 h-12 bg-blue-400/20 rotate-45 animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-blue-400/20 rotate-12 animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
          
          {/* Rotating Ring */}
          <div className="absolute top-1/3 right-1/3 w-32 h-32 border-4 border-blue-400/20 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
        </div>

        <div className="text-center relative z-10 w-full max-w-md px-6">
          {/* Animated Logo/Icon */}
          <div className="relative mb-8">
            <div className="w-40 h-40 mx-auto relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
              
              {/* Pulsing background */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              
              {/* Main circle with percentage */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-full w-40 h-40 flex items-center justify-center border-4 border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-1">
                    {progress}%
                  </div>
                  <div className="text-xs text-blue-100 font-bold">
                    Loading
                  </div>
                </div>
              </div>
              
              {/* Orbiting dot */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '2s'}}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-3xl font-black text-white mb-2">
            Loading Candidates
          </h2>
          <p className="text-blue-200/70 text-lg mb-8">
            Please wait while we prepare your data
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-white/20 mb-6">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
              style={{width: `${progress}%`}}
            >
              {progress > 10 && (
                <span className="text-xs font-bold text-white">{progress}%</span>
              )}
            </div>
          </div>

          {/* Loading Status */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${progress >= 33 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'}`}>
              <span className="text-sm font-bold text-white">Connecting to database</span>
              {progress >= 33 && <span className="text-blue-400">✓</span>}
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${progress >= 66 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'}`}>
              <span className="text-sm font-bold text-white">Fetching candidates</span>
              {progress >= 66 && <span className="text-blue-400">✓</span>}
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${progress >= 100 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'}`}>
              <span className="text-sm font-bold text-white">Preparing interface</span>
              {progress >= 100 && <span className="text-blue-400">✓</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white">All Candidates</h3>
          <p className="text-blue-200/70">Showing {filteredCandidates.length} of {candidates.length} candidates</p>
        </div>
        
        <div className="flex gap-3">
          {/* Assign Filtered Button */}
          {filteredCandidates.length > 0 && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <UserPlus size={20} />
              Assign Filtered
            </button>
          )}

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
          >
            <Filter size={20} />
            Filters
          </button>

          {/* Delete All Button */}
          {candidates.length > 0 && (
            <button
              onClick={handleDeleteAllCandidates}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Trash2 size={20} />
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-black text-white">🔍 Filter Candidates</h4>
            <button onClick={clearFilters} className="text-sm text-blue-300 hover:text-blue-200 font-bold">
              Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="number"
              placeholder="Age"
              value={filters.age}
              onChange={(e) => setFilters({...filters, age: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={filters.address}
              onChange={(e) => setFilters({...filters, address: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Position"
              value={filters.position}
              onChange={(e) => setFilters({...filters, position: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Education"
              value={filters.education}
              onChange={(e) => setFilters({...filters, education: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-white/5 border-b border-white/20">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Name</th>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Phone</th>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Age</th>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Address</th>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Company</th>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Position</th>
          <th className="px-6 py-4 text-left text-sm font-black text-white">Education</th>
          <th className="px-6 py-4 text-center text-sm font-black text-white">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredCandidates.length === 0 ? (
          <tr>
            <td colSpan="8" className="px-6 py-12 text-center text-white/50">
              No candidates found
            </td>
          </tr>
        ) : (
          // Slice to first 10
          filteredCandidates.slice(0, 10).map((candidate) => (
            <tr key={candidate.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-white font-bold">{candidate.name}</td>
              <td className="px-6 py-4 text-blue-200/80">{candidate.phone}</td>
              <td className="px-6 py-4 text-blue-200/80">{candidate.age || '-'}</td>
              <td className="px-6 py-4 text-blue-200/80">{candidate.address || '-'}</td>
              <td className="px-6 py-4 text-blue-200/80">{candidate.company || '-'}</td>
              <td className="px-6 py-4 text-blue-200/80">{candidate.position || '-'}</td>
              <td className="px-6 py-4 text-blue-200/80">{candidate.education || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-all border border-red-500/50"
                    title="Delete candidate"
                  >
                    <Trash2 size={16} className="text-red-300" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white">Assign Filtered Candidates</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Select Employee</label>
                <select
                  value={selectedEmployee?.id || ''}
                  onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === parseInt(e.target.value)))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map(emp => (
                    <option
                      key={emp.id}
                      value={emp.id}
                      style={{ backgroundColor: '#151c31ff', color: 'white' }}
                    >{emp.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Number of Candidates</label>
                <input
                  type="number"
                  value={assignCount}
                  onChange={(e) => setAssignCount(Math.min(parseInt(e.target.value) || 0, unassignedFilteredCandidates.length))}
                  max={unassignedFilteredCandidates.length}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                <p className="text-sm text-white">
                  <span className="font-black">{unassignedFilteredCandidates.length}</span> unassigned candidates available from filter
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignFiltered}
                  disabled={!selectedEmployee || assignCount === 0 || assigning}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assigning ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllCandidates;