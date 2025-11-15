import React from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

const AssignmentsFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  onRefresh,
  onExport
}) => {
  const statuses = [
    'All',
    'New',
    'Contacted',
    'In Progress',
    'Qualified',
    'Rejected',
    'Hired'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'All': 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      'New': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'Contacted': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      'Qualified': 'bg-green-100 text-green-700 hover:bg-green-200',
      'Rejected': 'bg-red-100 text-red-700 hover:bg-red-200',
      'Hired': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    };
    return colors[status] || colors['All'];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters & Search</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === status
                ? 'ring-2 ring-offset-2 ring-indigo-500 ' + getStatusColor(status)
                : getStatusColor(status)
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsFilters;