import { Package, Clock, AlertCircle, CheckCircle, TrendingUp, User } from 'lucide-react';

function DashboardView({ employee, stats, assignments, setActiveView }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">
          Welcome back 👋
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
  );
}

export default DashboardView;