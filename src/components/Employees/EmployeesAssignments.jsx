import React, { useState } from 'react';
import  API_URL  from '../../config/api';

function EmployeesAssignments({ employees, candidates, assignments, onAssign }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignCount, setAssignCount] = useState(10);
  const [assigning, setAssigning] = useState(false);

  const unassignedCandidates = candidates.filter(
    c => !assignments.some(a => a.candidateId === c.id)
  );

const handleAssign = async () => {
  if (!selectedEmployee || assignCount === 0) return;

  setAssigning(true);
  try {
    const toAssign = unassignedCandidates.slice(0, assignCount);
    
    console.log('👤 Selected Employee:', selectedEmployee); // Debug
    console.log('📋 Candidates to assign:', toAssign); // Debug
    
    const newAssignments = toAssign.map(c => ({
      employeeId: selectedEmployee.id,
      candidateId: c.id,
      status: 'pending'
    }));

    console.log('📤 Sending assignments:', newAssignments); // Debug

    const response = await fetch(`${API_URL}/assignments/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assignments: newAssignments })
    });

    const data = await response.json();
    
    console.log('📥 Server response:', data); // Debug

    if (data.success) {
      onAssign([...assignments, ...newAssignments]);
      setSelectedEmployee(null);
      setAssignCount(10);
      alert(`✅ Successfully assigned ${data.count} candidates`);
    } else {
      alert(`❌ Error: ${data.message}`);
    }

  } catch (error) {
    console.error('❌ Assignment error:', error);
    alert(`❌ An error occurred: ${error.message}`);
  } finally {
    setAssigning(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-black text-white mb-4">👥 Team Members</h3>
          <div className="space-y-3">
            {employees.map(emp => {
              const empAssignments = assignments.filter(a => a.employeeId === emp.id);
              return (
                <div key={emp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
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

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-black text-white mb-4">➕ Assign Candidates</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Select Employee</label>
              <select
                value={selectedEmployee?.id || ''}
                onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === parseInt(e.target.value)))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose an employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Number of Candidates</label>
              <input
                type="number"
                value={assignCount}
                onChange={(e) => setAssignCount(Math.min(parseInt(e.target.value) || 0, unassignedCandidates.length))}
                max={unassignedCandidates.length}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
              <p className="text-sm text-white">
                <span className="font-black">{unassignedCandidates.length}</span> unassigned candidates available
              </p>
            </div>

            <button
              onClick={handleAssign}
              disabled={!selectedEmployee || assignCount === 0 || assigning}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assigning ? 'Assigning...' : 'Assign Candidates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeesAssignments;
