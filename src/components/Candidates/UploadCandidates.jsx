import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import API_URL from '../../config/api';

function UploadCandidates({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const downloadTemplate = () => {
    const a = document.createElement('a');
    a.href = '../../../candidates_template.csv'; // من مجلد public
    a.download = 'candidates_template.csv';
    a.click();
  };


  const handleFileUpload = async (file) => {
    setUploading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

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

      const response = await fetch(`${API_URL}/candidates/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidates })
      });

      const data = await response.json();

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
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'
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
          <div className={`mt-6 p-4 rounded-xl ${uploadResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
            <p className="text-white font-bold">
              {uploadResult.success
                ? `✅ Successfully uploaded ${uploadResult.count} candidates!`
                : `❌ Error: ${uploadResult.error}`
              }
            </p>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-black text-white mb-4 text-left">📋 Template Information</h3>
        <p className="text-blue-200/80 mb-4 text-left">: Download our template to ensure your file is formatted correctly</p>

        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all float-left"
        >
          <Download size={20} />
          Download Template
        </button>

        <div className="mt-4 p-4 bg-white/5 rounded-xl px-2 py-3">
          <p className="text-sm text-blue-200/70 font-mono ">
            Required columns: Name, Phone, Age, Address, Company, Position, Education
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadCandidates;
