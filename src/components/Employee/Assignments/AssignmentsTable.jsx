import React from 'react';
import { Edit, Phone, Mail, Calendar, Briefcase, MapPin } from 'lucide-react';

const AssignmentsTable = ({ assignments, onEdit, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-purple-100 text-purple-700',
      'Contacted': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Qualified': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Hired': 'bg-indigo-100 text-indigo-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const statuses = ['New', 'Contacted', 'In Progress', 'Qualified', 'Rejected', 'Hired'];

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assignments Found</h3>
        <p className="text-gray-500">No candidates match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Candidate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Assigned Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignments.map((assignment) => {
              const candidate = assignment.candidate;
              const assignedDate = new Date(assignment.assignedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{candidate.name}</p>
                      <p className="text-sm text-gray-500">ID: {candidate.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1 text-gray-700">
                        <Mail className="w-3 h-3" />
                        {candidate.email}
                      </p>
                      <p className="text-sm flex items-center gap-1 text-gray-700">
                        <Phone className="w-3 h-3" />
                        {candidate.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-800">
                        {candidate.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {candidate.location || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={assignment.status}
                      onChange={(e) => onUpdateStatus(assignment.id, e.target.value)}
                      className={`px-3 py-2 rounded-lg font-medium text-sm border-0 cursor-pointer ${getStatusColor(assignment.status)}`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{assignedDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEdit(assignment)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsTable;