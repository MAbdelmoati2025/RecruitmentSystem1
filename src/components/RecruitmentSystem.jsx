import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import UploadCandidates from './Candidates/UploadCandidates';
import AllCandidates from './Candidates/AllCandidates';
import EmployeesAssignments from './Employees/EmployeesAssignments';
import SummaryReport from './Reports/SummaryReport';
import Report from './Reports/ReportsPage';

import API_URL from '../config/api';

function RecruitmentSystem() {
  const [currentPage, setCurrentPage] = useState('dashboard');
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
    sessionStorage.removeItem('employee');
    window.location.href = '/';
  };

  // 🔥 Handle candidate deletion
  const handleDeleteCandidate = (candidateId) => {
    if (candidateId === 'all') {
      // Delete all
      setCandidates([]);
      loadStoredData(); // Reload from server
    } else {
      // Delete single - تأكد إن الـ ID صحيح
      const id = parseInt(candidateId);
      console.log('Deleting candidate with ID:', id); // Debug

      setCandidates(prev => prev.filter(c => c.id !== id));
      loadStoredData(); // Reload from server
    }
  };

  // 🔥 Handle assignment
  const handleAssign = (newAssignments) => {
    console.log('📥 New assignments:', newAssignments); // Debug log

    // تحديث الـ state
    setAssignments([...assignments, ...newAssignments]);

    // إعادة تحميل البيانات
    loadStoredData();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard candidates={candidates} employees={employees} assignments={assignments} />;

      case 'upload':
        return <UploadCandidates onUpload={(newCandidates) => {
          loadStoredData(); // Reload all data after upload
        }} />;

      case 'candidates':
        return (
          <AllCandidates
            candidates={candidates}
            filters={filters}
            setFilters={setFilters}
            onDelete={handleDeleteCandidate}  // ✅ تأكد إنها ممررة صح
            employees={employees}
            assignments={assignments}
            onAssign={(newAssignments) => {
              setAssignments([...assignments, ...newAssignments]);
              loadStoredData();
            }}
          />
        );

      case 'employees':
        return (
          <EmployeesAssignments
            employees={employees}
            candidates={candidates}
            assignments={assignments}
            onAssign={(newAssignments) => {
              setAssignments(newAssignments);
              loadStoredData();
            }}
          />
        );

      case 'summary':
        return <SummaryReport employees={employees} assignments={assignments} />;
      case 'Report':
        return <Report employees={employees} assignments={assignments} />;

      default:
        return <Dashboard candidates={candidates} employees={employees} assignments={assignments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        candidatesCount={candidates.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-6 -mt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'upload' && '📤 Upload Candidates'}
              {currentPage === 'candidates' && '👥 All Candidates'}
              {currentPage === 'employees' && '👨‍💼 Employees & Assignments'}
              {currentPage === 'summary' && '📊 Summary Report'}
              {currentPage === 'Report' && '📊  Report'}


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

export default RecruitmentSystem;
