import React, { useState } from 'react';
import { Upload, Download, AlertTriangle, X } from 'lucide-react';
import API_URL from '../../config/api';

function UploadCandidates({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [duplicateData, setDuplicateData] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const downloadTemplate = () => {
    const a = document.createElement('a');
    a.href = '../../../candidates_template.csv';
    a.download = 'candidates_template.csv';
    a.click();
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');

      const candidates = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim());
        const candidate = {
          name: values[0] || '',
          phone: values[1] || '',
          age: parseInt(values[2]) || null,
          address: values[3] || '',
          company: values[4] || '',
          position: values[5] || '',
          education: values[6] || ''
        };

        if (candidate.phone && candidate.name) {
          candidates.push(candidate);
        }
      }

      // Get current user
      const currentUser = JSON.parse(sessionStorage.getItem('employee') || '{}');

      const response = await fetch(`${API_URL}/candidates/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          candidates,
          uploadedBy: currentUser.fullName || 'Unknown'
        })
      });

      const data = await response.json();

      // 🔥 إذا فيه تكرارات
      if (response.status === 409 && data.isDuplicate) {
        setDuplicateData(data);
        setShowDuplicateModal(true);
        setUploading(false);
        return;
      }

      if (data.success) {
        setUploadResult({ success: true, count: data.count });
        onUpload(candidates);
      } else {
        setUploadResult({ success: false, error: data.message });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({ success: false, error: error.message });
    } finally {
      setUploading(false);
    }
  };

  // 🔥 حل مشكلة التكرار
  const handleResolveDuplicates = async (action) => {
    if (!duplicateData) return;

    setUploading(true);
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('employee') || '{}');

      const response = await fetch(`${API_URL}/candidates/resolve-duplicates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          candidates: duplicateData.candidatesToUpload,
          action: action,
          uploadedBy: currentUser.fullName || 'Unknown'
        })
      });

      const data = await response.json();

      if (data.success) {
        setUploadResult({ success: true, count: data.count });
        setShowDuplicateModal(false);
        setDuplicateData(null);
        onUpload(duplicateData.candidatesToUpload);
      } else {
        setUploadResult({ success: false, error: data.message });
      }

    } catch (error) {
      console.error('Resolve duplicates error:', error);
      setUploadResult({ success: false, error: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white mb-2">Upload Candidates File</h3>
          <p className="text-blue-200/70">Upload a CSV file with candidate information (up to 10,000 records)</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'
          }`}
        >
          <Upload size={48} className="mx-auto mb-4 text-blue-400" />
          <p className="text-white font-bold mb-2">Drag and drop your CSV file here</p>
          <p className="text-sm text-blue-200/70 mb-4">or</p>
          <label className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold cursor-pointer inline-block hover:shadow-lg transition-all">
            Browse Files
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileUpload(file);
              }}
            />
          </label>
        </div>

        {uploading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2">Uploading and processing...</p>
          </div>
        )}

        {uploadResult && (
          <div className={`mt-6 p-4 rounded-xl ${
            uploadResult.success 
              ? 'bg-green-500/20 border border-green-500/50' 
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            <p className="text-white font-bold">
              {uploadResult.success
                ? `✅ Successfully uploaded ${uploadResult.count} candidates!`
                : `❌ Error: ${uploadResult.error}`
              }
            </p>
          </div>
        )}
      </div>

      {/* 🔥 Duplicate Detection Modal */}
      {showDuplicateModal && duplicateData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl no-scrollbar p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 ">
                <AlertTriangle size={32} className="text-yellow-400" />
                <h3 className="text-2xl font-black text-white">Duplicates Detected</h3>
              </div>
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicateData(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Info */}
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                <p className="text-white font-bold">
                  Found {duplicateData.duplicates.inCandidates.length} duplicates in active candidates 
                  and {duplicateData.duplicates.inHistory.length} in history database
                </p>
              </div>

              {/* Duplicates in Current Candidates */}
              {duplicateData.duplicates.inCandidates.length > 0 && (
                <div>
                  <h4 className="text-lg font-black text-white mb-3">📋 In Current Candidates</h4>
                  <div className="bg-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/10 border-b border-white/20">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Company</th>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {duplicateData.duplicates.inCandidates.map((dup, idx) => (
                            <tr key={idx} className="border-b border-white/10">
                              <td className="px-4 py-3 text-blue-200/80">{dup.name}</td>
                              <td className="px-4 py-3 text-blue-200/80">{dup.phone}</td>
                              <td className="px-4 py-3 text-blue-200/80">{dup.company || '-'}</td>
                              <td className="px-4 py-3 text-blue-200/80">{dup.position || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Duplicates in History */}
              {duplicateData.duplicates.inHistory.length > 0 && (
                <div>
                  <h4 className="text-lg font-black text-white mb-3">🗄️ In History Database</h4>
                  <div className="bg-white/5 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/10 border-b border-white/20 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-black text-white">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {duplicateData.duplicates.inHistory.map((dup, idx) => (
                            <tr key={idx} className="border-b border-white/10">
                              <td className="px-4 py-3 text-blue-200/80">{dup.name}</td>
                              <td className="px-4 py-3 text-blue-200/80">{dup.phone}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                  dup.isActive 
                                    ? 'bg-green-500/20 text-green-300' 
                                    : 'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {dup.isActive ? 'Active' : 'Deleted'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-blue-200/80 text-sm">
                                {new Date(dup.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <p className="text-white font-bold text-center mb-4">? What would you like to do</p>
                
                <button
                  onClick={() => handleResolveDuplicates('skip')}
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  ⏭️ Skip Duplicates (Add Only New)
                </button>
                
                <button
                  onClick={() => handleResolveDuplicates('merge')}
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  🔄 Merge (Update Existing with New Data)
                </button>
                
                <button
                  onClick={() => handleResolveDuplicates('replace')}
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  🔁 Replace (Delete Old, Add New)
                </button>

                <button
                  onClick={() => {
                    setShowDuplicateModal(false);
                    setDuplicateData(null);
                  }}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-black text-white mb-4 text-left">📋 Template Information</h3>
        <p className="text-blue-200/80 mb-4 text-left">Download our template to ensure your file is formatted correctly</p>

        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r mb-5 from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all float-left"
        >
          <Download size={20} />
          Download Template
        </button>

        <div className="mt-4 p-4 bg-white/5 rounded-xl px-2 py-3 clear-both">
          <p className="text-sm text-blue-200/70 font-mono text-left" >
            Required columns: Name, Phone, Age, Address, Company, Position, Education
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadCandidates;