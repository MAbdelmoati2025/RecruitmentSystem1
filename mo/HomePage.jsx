import { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, Users, UserCheck, BarChart3, X, Download, Filter, Plus } from 'lucide-react';
import IconImage from '../photos/icon10.png'; // تأكد المسار صحيح

// Simulated employee data
const MOCK_EMPLOYEE = {
  id: 1,
  username: 'admin',
  fullName: 'أحمد محمد',
  email: 'admin@company.com',
  position: 'مدير النظام'
};

const API_URL = 'http://localhost:3000/api';

function RecruitmentSystem() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filters, setFilters] = useState({
    age: '',
    address: '',
    company: '',
    position: '',
    education: ''
  });

  // Load initial data
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      // Load candidates
      const candidatesRes = await fetch(`${API_URL}/candidates`);
      if (candidatesRes.ok) {
        const data = await candidatesRes.json();
        setCandidates(data.candidates || []);
      }

      // Load employees
      const employeesRes = await fetch(`${API_URL}/employees`);
      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data.employees || []);
      }

      // Load assignments
      const assignmentsRes = await fetch(`${API_URL}/assignments`);
      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
  // 🔥 امسح بيانات المستخدم من sessionStorage
  sessionStorage.removeItem('employee');
  
  // 🔥 ارجع لصفحة اللوجن
  window.location.href = '/';
};

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard candidates={candidates} employees={employees} assignments={assignments} />;
      case 'upload':
        return <UploadCandidates onUpload={(newCandidates) => {
          setCandidates(newCandidates);
        }} />;
      case 'candidates':
        return <AllCandidates candidates={candidates} filters={filters} setFilters={setFilters} />;
      case 'employees':
        return <EmployeesAssignments 
          employees={employees} 
          candidates={candidates} 
          assignments={assignments}
          onAssign={(newAssignments) => {
            setAssignments(newAssignments);
            loadStoredData(); // Reload to get fresh data
          }}
        />;
      case 'summary':
        return <SummaryReport employees={employees} assignments={assignments} />;
      default:
        return <Dashboard candidates={candidates} employees={employees} assignments={assignments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
                                src={IconImage} // أو المسار المناسب
                                alt="Logo"
                                className="w-14 h-14 object-contain rounded-2xl"
                              />
            <div>
              <h1 className="text-xl font-black text-white">Nexploy</h1>
              <p className="text-xs text-blue-200/70">Recruitment System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')}
          />
          <SidebarItem 
            icon={<Upload size={20} />} 
            label="Upload Candidates" 
            active={currentPage === 'upload'}
            onClick={() => setCurrentPage('upload')}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="All Candidates" 
            active={currentPage === 'candidates'}
            onClick={() => setCurrentPage('candidates')}
            badge={candidates.length}
          />
          <SidebarItem 
            icon={<UserCheck size={20} />} 
            label="Employees" 
            active={currentPage === 'employees'}
            onClick={() => setCurrentPage('employees')}
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Summary Report" 
            active={currentPage === 'summary'}
            onClick={() => setCurrentPage('summary')}
          />
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
              {MOCK_EMPLOYEE.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{MOCK_EMPLOYEE.fullName}</p>
              <p className="text-xs text-blue-200/70 truncate">{MOCK_EMPLOYEE.position}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'upload' && '📤 Upload Candidates'}
              {currentPage === 'candidates' && '👥 All Candidates'}
              {currentPage === 'employees' && '👨‍💼 Employees & Assignments'}
              {currentPage === 'summary' && '📊 Summary Report'}
            </h2>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-bold text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span className="flex-1 text-left font-bold text-sm">{label}</span>
      {badge > 0 && (
        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

function Dashboard({ candidates, employees, assignments }) {
  const stats = [
    { label: 'Total Candidates', value: candidates.length, icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Employees', value: employees.length, icon: '👨‍💼', color: 'from-purple-500 to-pink-500' },
    { label: 'Assigned', value: assignments.length, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { label: 'Pending', value: candidates.length - assignments.length, icon: '⏳', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-blue-200/80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-black text-white mb-4">📊 Quick Overview</h3>
        <div className="space-y-3">
          {employees.map(emp => {
            const empAssignments = assignments.filter(a => a.employeeId === emp.id);
            return (
              <div key={emp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-bold text-white">{emp.fullName}</p>
                  <p className="text-sm text-blue-200/70">{emp.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{empAssignments.length}</p>
                  <p className="text-xs text-blue-200/70">Assigned</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UploadCandidates({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const downloadTemplate = () => {
    const csvContent = "Name,Phone,Age,Address,Company,Position,Education\nأحمد محمد,01012345678,28,القاهرة,شركة ABC,مبرمج,بكالوريوس حاسبات\nسارة علي,01112345678,25,الجيزة,شركة XYZ,محاسبة,بكالوريوس تجارة";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
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

      // 🔥 هنا التعديل: إرسال البيانات للـ API بدلاً من window.storage
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
        onUpload(candidates); // تحديث الـ state المحلي
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
    <div className="max-w-4xl mx-auto space-y-6">
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
        <h3 className="text-xl font-black text-white mb-4">📋 Template Information</h3>
        <p className="text-blue-200/80 mb-4">Download our template to ensure your file is formatted correctly:</p>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Download size={20} />
          Download Template
        </button>
        <div className="mt-4 p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-blue-200/70 font-mono">
            Required columns: Name, Phone, Age, Address, Company, Position, Education
          </p>
        </div>
      </div>
    </div>
  );
}

function AllCandidates({ candidates, filters, setFilters }) {
  const [showFilters, setShowFilters] = useState(false);

  const filteredCandidates = candidates.filter(candidate => {
    if (filters.age && candidate.age !== parseInt(filters.age)) return false;
    if (filters.address && !candidate.address?.toLowerCase().includes(filters.address.toLowerCase())) return false;
    if (filters.company && !candidate.company?.toLowerCase().includes(filters.company.toLowerCase())) return false;
    if (filters.position && !candidate.position?.toLowerCase().includes(filters.position.toLowerCase())) return false;
    if (filters.education && !candidate.education?.toLowerCase().includes(filters.education.toLowerCase())) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({ age: '', address: '', company: '', position: '', education: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white">All Candidates</h3>
          <p className="text-blue-200/70">Showing {filteredCandidates.length} of {candidates.length} candidates</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-black text-white">🔍 Filter Candidates</h4>
            <button onClick={clearFilters} className="text-sm text-blue-300 hover:text-blue-200 font-bold">
              Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="number"
              placeholder="Age"
              value={filters.age}
              onChange={(e) => setFilters({...filters, age: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={filters.address}
              onChange={(e) => setFilters({...filters, address: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Position"
              value={filters.position}
              onChange={(e) => setFilters({...filters, position: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Education"
              value={filters.education}
              onChange={(e) => setFilters({...filters, education: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Age</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Address</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Company</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Position</th>
                <th className="px-6 py-4 text-left text-sm font-black text-white">Education</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-bold">{candidate.name}</td>
                  <td className="px-6 py-4 text-blue-200/80">{candidate.phone}</td>
                  <td className="px-6 py-4 text-blue-200/80">{candidate.age || '-'}</td>
                  <td className="px-6 py-4 text-blue-200/80">{candidate.address || '-'}</td>
                  <td className="px-6 py-4 text-blue-200/80">{candidate.company || '-'}</td>
                  <td className="px-6 py-4 text-blue-200/80">{candidate.position || '-'}</td>
                  <td className="px-6 py-4 text-blue-200/80">{candidate.education || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeesAssignments({ employees, candidates, assignments, onAssign }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignCount, setAssignCount] = useState(10);
  const [assigning, setAssigning] = useState(false);

  const unassignedCandidates = candidates.filter(
    c => !assignments.some(a => a.candidateId === c.id)
  );

  const handleAssign = async () => {
    if (!selectedEmployee || assignCount === 0) return;

    setAssigning(true);
    try {
      const toAssign = unassignedCandidates.slice(0, assignCount);
      const newAssignments = toAssign.map(c => ({
        employeeId: selectedEmployee.id,
        candidateId: c.id,
        status: 'pending'
      }));

      const response = await fetch(`${API_URL}/assignments/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments: newAssignments })
      });

      const data = await response.json();

      if (data.success) {
        onAssign([...assignments, ...newAssignments]);
        setSelectedEmployee(null);
        setAssignCount(10);
        alert(`✅ تم تعيين ${data.count} مرشح بنجاح`);
      } else {
        alert(`❌ خطأ: ${data.message}`);
      }

    } catch (error) {
      console.error('Assignment error:', error);
      alert(`❌ حدث خطأ: ${error.message}`);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-black text-white mb-4">👥 Team Members</h3>
          <div className="space-y-3">
            {employees.map(emp => {
              const empAssignments = assignments.filter(a => a.employeeId === emp.id);
              return (
                <div key={emp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div>
                    <p className="font-bold text-white">{emp.fullName}</p>
                    <p className="text-sm text-blue-200/70">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{empAssignments.length}</p>
                    <p className="text-xs text-blue-200/70">Assigned</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-black text-white mb-4">➕ Assign Candidates</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Select Employee</label>
              <select
                value={selectedEmployee?.id || ''}
                onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === parseInt(e.target.value)))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose an employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Number of Candidates</label>
              <input
                type="number"
                value={assignCount}
                onChange={(e) => setAssignCount(Math.min(parseInt(e.target.value) || 0, unassignedCandidates.length))}
                max={unassignedCandidates.length}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
              <p className="text-sm text-white">
                <span className="font-black">{unassignedCandidates.length}</span> unassigned candidates available
              </p>
            </div>

            <button
              onClick={handleAssign}
              disabled={!selectedEmployee || assignCount === 0 || assigning}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assigning ? 'Assigning...' : 'Assign Candidates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryReport({ employees, assignments }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-black text-white mb-6">📊 Team Performance Summary</h3>
        <div className="space-y-4">
          {employees.map(emp => {
            const empAssignments = assignments.filter(a => a.employeeId === emp.id);
            const completed = empAssignments.filter(a => a.status === 'completed').length;
            const inProgress = empAssignments.filter(a => a.status === 'in_progress').length;
            const pending = empAssignments.filter(a => a.status === 'pending').length;
            const completionRate = empAssignments.length > 0 ? Math.round((completed / empAssignments.length) * 100) : 0;

            return (
              <div key={emp.id} className="p-6 bg-white/5 rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-black text-white">{emp.fullName}</h4>
                    <p className="text-sm text-blue-200/70">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">{completionRate}%</p>
                    <p className="text-xs text-blue-200/70">Completion Rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-500/20 border border-green-500/50 rounded-xl">
                    <p className="text-2xl font-black text-white">{completed}</p>
                    <p className="text-xs text-green-200">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                    <p className="text-2xl font-black text-white">{inProgress}</p>
                    <p className="text-xs text-blue-200">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-orange-500/20 border border-orange-500/50 rounded-xl">
                    <p className="text-2xl font-black text-white">{pending}</p>
                    <p className="text-xs text-orange-200">Pending</p>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-bold inline-block text-blue-200">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold inline-block text-white">
                        {completed}/{empAssignments.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-white/10">
                    <div
                      style={{ width: `${completionRate}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-3">✅</div>
          <h4 className="text-2xl font-black text-white mb-1">
            {assignments.filter(a => a.status === 'completed').length}
          </h4>
          <p className="text-sm text-blue-200/80">Total Completed</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-3">🔄</div>
          <h4 className="text-2xl font-black text-white mb-1">
            {assignments.filter(a => a.status === 'in_progress').length}
          </h4>
          <p className="text-sm text-blue-200/80">In Progress</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-3">⏳</div>
          <h4 className="text-2xl font-black text-white mb-1">
            {assignments.filter(a => a.status === 'pending').length}
          </h4>
          <p className="text-sm text-blue-200/80">Pending</p>
        </div>
      </div>
    </div>
  );
}

export default RecruitmentSystem;
