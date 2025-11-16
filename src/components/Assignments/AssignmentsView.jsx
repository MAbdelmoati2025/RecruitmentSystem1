import { Search, Filter, ClipboardList, User, Phone, Mail, Building, Eye, MessageCircle } from 'lucide-react';

function AssignmentsView({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredAssignments,
  openDetailsModal,
  openWhatsApp,
  updateAssignmentStatus
}) {
  return (
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
  );
}

export default AssignmentsView;