import React from 'react';

function SummaryReport({ employees, assignments }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-black text-white mb-6">📊 Team Performance Summary</h3>
        <div className="space-y-4">
          {employees.map(emp => {
            const empAssignments = assignments.filter(a => a.employeeId === emp.id);
            const completed = empAssignments.filter(a => a.status === 'completed').length;
            const inProgress = empAssignments.filter(a => a.status === 'in_progress').length;
            const pending = empAssignments.filter(a => a.status === 'pending').length;
            const completionRate = empAssignments.length > 0 ? Math.round((completed / empAssignments.length) * 100) : 0;

            return (
              <div key={emp.id} className="p-6 bg-white/5 rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-black text-white">{emp.fullName}</h4>
                    <p className="text-sm text-blue-200/70">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">{completionRate}%</p>
                    <p className="text-xs text-blue-200/70">Completion Rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-500/20 border border-green-500/50 rounded-xl">
                    <p className="text-2xl font-black text-white">{completed}</p>
                    <p className="text-xs text-green-200">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                    <p className="text-2xl font-black text-white">{inProgress}</p>
                    <p className="text-xs text-blue-200">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-orange-500/20 border border-orange-500/50 rounded-xl">
                    <p className="text-2xl font-black text-white">{pending}</p>
                    <p className="text-xs text-orange-200">Pending</p>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-bold inline-block text-blue-200">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold inline-block text-white">
                        {completed}/{empAssignments.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-white/10">
                    <div
                      style={{ width: `${completionRate}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-3">✅</div>
          <h4 className="text-2xl font-black text-white mb-1">
            {assignments.filter(a => a.status === 'completed').length}
          </h4>
          <p className="text-sm text-blue-200/80">Total Completed</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-3">🔄</div>
          <h4 className="text-2xl font-black text-white mb-1">
            {assignments.filter(a => a.status === 'in_progress').length}
          </h4>
          <p className="text-sm text-blue-200/80">In Progress</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-3">⏳</div>
          <h4 className="text-2xl font-black text-white mb-1">
            {assignments.filter(a => a.status === 'pending').length}
          </h4>
          <p className="text-sm text-blue-200/80">Pending</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryReport;
