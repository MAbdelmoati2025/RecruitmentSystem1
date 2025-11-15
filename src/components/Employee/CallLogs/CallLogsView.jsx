import React, { useState, useEffect } from 'react';
import { Phone, Calendar, User, FileText, Search, Filter } from 'lucide-react';
import API_URL from '../../../config/api';

const CallLogsView = ({ employeeId }) => {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchCallLogs();
  }, [employeeId]);

  const fetchCallLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/call-logs/employee/${employeeId}`);
      if (response.ok) {
        const data = await response.json();
        setCallLogs(data);
      }
    } catch (error) {
      console.error('Error fetching call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...callLogs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.callDate);
        return logDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => new Date(log.callDate) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => new Date(log.callDate) >= monthAgo);
    }

    return filtered;
  };

  const filteredLogs = filterLogs();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Call History</h2>
            <p className="text-indigo-100">View all your call logs and notes</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by candidate name or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Call Logs */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Call Logs Found</h3>
          <p className="text-gray-500">No calls match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {log.candidate?.name || 'Unknown Candidate'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {log.candidate?.position || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(log.callDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Call Notes:</p>
                    <p className="text-gray-600 whitespace-pre-wrap">{log.notes || 'No notes available'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>Log ID: {log.id}</span>
                <span>Assignment ID: {log.assignmentId}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total Calls</p>
          <p className="text-3xl font-bold text-gray-800">{callLogs.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">This Week</p>
          <p className="text-3xl font-bold text-gray-800">
            {callLogs.filter(log => {
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return new Date(log.callDate) >= weekAgo;
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Today</p>
          <p className="text-3xl font-bold text-gray-800">
            {callLogs.filter(log => {
              return new Date(log.callDate).toDateString() === new Date().toDateString();
            }).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallLogsView;