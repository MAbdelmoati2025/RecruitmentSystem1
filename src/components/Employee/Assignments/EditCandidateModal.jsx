import React, { useState, useEffect } from 'react';
import { X, Save, Phone, FileText, Calendar } from 'lucide-react';
import API_URL from '../../../config/api';

const EditCandidateModal = ({ assignment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    location: '',
    status: 'New'
  });
  const [callNote, setCallNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
        name: assignment.candidate.name || '',
        email: assignment.candidate.email || '',
        phone: assignment.candidate.phone || '',
        position: assignment.candidate.position || '',
        location: assignment.candidate.location || '',
        status: assignment.status || 'New'
      });
    }
  }, [assignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update candidate info
      const candidateResponse = await fetch(`${API_URL}/api/candidates/${assignment.candidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          location: formData.location
        })
      });

      if (!candidateResponse.ok) throw new Error('Failed to update candidate');

      // Update assignment status
      const statusResponse = await fetch(`${API_URL}/api/assignments/${assignment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: formData.status })
      });

      if (!statusResponse.ok) throw new Error('Failed to update status');

      // Save call log if note provided
      if (callNote.trim()) {
        await fetch(`${API_URL}/api/call-logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId: assignment.id,
            employeeId: assignment.employeeId,
            candidateId: assignment.candidate.id,
            notes: callNote,
            callDate: new Date().toISOString()
          })
        });
      }

      alert('Candidate updated successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return null;

  const statuses = ['New', 'Contacted', 'In Progress', 'Qualified', 'Rejected', 'Hired'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Edit Candidate</h2>
            <p className="text-indigo-100 text-sm">Update candidate information and status</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Call Notes Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-indigo-600" />
              <label className="text-sm font-medium text-gray-700">
                Call Notes (Optional)
              </label>
            </div>
            <textarea
              value={callNote}
              onChange={(e) => setCallNote(e.target.value)}
              placeholder="Add notes about the call, conversation details, next steps..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              <FileText className="w-3 h-3 inline mr-1" />
              These notes will be saved to the call log history
            </p>
          </div>

          {/* Assignment Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-700">Assignment Information</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600">
                Assigned Date: <span className="font-medium text-gray-800">
                  {new Date(assignment.assignedAt).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-600">
                Assignment ID: <span className="font-medium text-gray-800">
                  {assignment.id}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCandidateModal;