import {
  User, X, MessageCircle, Edit, Save, Phone, Mail, Calendar,
  Building, Briefcase, GraduationCap, MapPin, Globe, FileText
} from 'lucide-react';

function CandidateModal({
  showDetailsModal,
  setShowDetailsModal,
  selectedAssignment,
  editMode,
  setEditMode,
  editedCandidate,
  setEditedCandidate,
  callNotes,
  setCallNotes,
  saving,
  handleSaveCandidate,
  openWhatsApp
}) {
  if (!showDetailsModal || !selectedAssignment || !editedCandidate) return null;

  return (
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
  );
}

export default CandidateModal;