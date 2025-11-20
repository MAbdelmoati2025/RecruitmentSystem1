import React, { useState, useEffect } from 'react';
import { Database, Filter, Download, Trash2 } from 'lucide-react';
import API_URL from '../../config/api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({
    isActive: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.isActive !== 'all') {
        params.append('isActive', filters.isActive);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await fetch(`${API_URL}/history?${params}`);
      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId, recordName) => {
    if (!window.confirm(`Are you sure you want to delete the record for ${recordName}?`)) {
      return;
    }

    setDeleting(recordId);
    try {
      const response = await fetch(`${API_URL}/history/${recordId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setHistory(history.filter(item => item.id !== recordId));
        alert('✅ History record deleted successfully');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ An error occurred while deleting the record');
    } finally {
      setDeleting(null);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search) ||
        item.company?.toLowerCase().includes(search) ||
        item.position?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Age', 'Address', 'Company', 'Position', 'Education', 'Status', 'Upload Date', 'Uploaded By'];
    const rows = filteredHistory.map(item => [
      item.name,
      item.phone,
      item.age || '',
      item.address || '',
      item.company || '',
      item.position || '',
      item.education || '',
      item.isActive ? 'A' : 'D',
      new Date(item.createdAt).toLocaleString(),
      item.uploadedBy || 'Unknown'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: history.length,
    active: history.filter(h => h.isActive).length,
    deleted: history.filter(h => !h.isActive).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200/70 text-sm font-bold">Total Records</p>
              <p className="text-3xl font-black text-white">{stats.total}</p>
            </div>
            <Database size={40} className="text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200/70 text-sm font-bold">Active</p>
              <p className="text-3xl font-black text-white">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200/70 text-sm font-bold">Deleted</p>
              <p className="text-3xl font-black text-white">{stats.deleted}</p>
            </div>
            <div className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">✕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-white" />
          <h3 className="text-lg font-black text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.isActive}
            onChange={(e) => {
              setFilters({ ...filters, isActive: e.target.value });
              setTimeout(loadHistory, 100);
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all" style={{ backgroundColor: '#151c31ff' }}>All Status</option>
            <option value="true" style={{ backgroundColor: '#151c31ff' }}>Active Only</option>
            <option value="false" style={{ backgroundColor: '#151c31ff' }}>Deleted Only</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={loadHistory}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              setFilters({ isActive: 'all', startDate: '', endDate: '', search: '' });
              setTimeout(loadHistory, 100);
            }}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20"
          >
            Clear
          </button>

          <button
            onClick={exportToCSV}
            className="ml-auto flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Company</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Position</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Uploaded By</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Upload Date</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Deleted At</th>
                <th className="px-6 py-4 text-center text-sm font-black text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-white/50">
                    No history records found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{item.name}</td>
                    <td className="px-6 py-4 text-blue-200/80">{item.phone}</td>
                    <td className="px-6 py-4 text-blue-200/80">{item.company || '-'}</td>
                    <td className="px-6 py-4 text-blue-200/80">{item.position || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.isActive 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/50'
                      }`}>
                        {item.isActive ? 'Active' : 'Deleted'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-200/80">{item.uploadedBy || 'Unknown'}</td>
                    <td className="px-6 py-4 text-blue-200/80 text-sm">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-blue-200/80 text-sm">
                      {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteRecord(item.id, item.name)}
                          disabled={deleting === item.id}
                          className="p-2 bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all border border-red-500/50"
                          title="Delete this history record"
                        >
                          {deleting === item.id ? (
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={16} className="text-red-300" />
                          )}
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
    </div>
  );
}

export default History;