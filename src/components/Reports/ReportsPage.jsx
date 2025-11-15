import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  X,
  Phone,
  Mail,
  Building,
  Briefcase,
  MapPin
} from 'lucide-react';

// ✅ الطريقة الصحيحة 100%
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import API_URL from '../../config/api';

function ReportsPage() {
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        generateReportData();
    }, [employees, assignments, searchTerm, dateFilter, statusFilter]);

    const loadData = async () => {
        try {
            const [employeesRes, assignmentsRes] = await Promise.all([
                fetch(`${API_URL}/employees`),
                fetch(`${API_URL}/assignments`)
            ]);

            const employeesData = await employeesRes.json();
            const assignmentsData = await assignmentsRes.json();

            if (employeesData.success) setEmployees(employeesData.employees);
            if (assignmentsData.success) setAssignments(assignmentsData.assignments);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const generateReportData = () => {
        let filteredAssignments = [...assignments];

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
            }

            filteredAssignments = filteredAssignments.filter(a =>
                new Date(a.assignedAt) >= filterDate
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filteredAssignments = filteredAssignments.filter(a =>
                a.status === statusFilter
            );
        }

        // Generate report for each employee
        const reports = employees.map(employee => {
            const employeeAssignments = filteredAssignments.filter(
                a => a.employeeId === employee.id
            );

            const stats = {
                total: employeeAssignments.length,
                pending: employeeAssignments.filter(a => a.status === 'pending').length,
                inProgress: employeeAssignments.filter(a => a.status === 'in_progress').length,
                completed: employeeAssignments.filter(a => a.status === 'completed').length,
                completionRate: employeeAssignments.length > 0
                    ? Math.round((employeeAssignments.filter(a => a.status === 'completed').length / employeeAssignments.length) * 100)
                    : 0
            };

            return {
                employee,
                stats,
                assignments: employeeAssignments
            };
        });

        // Search filter
        const filtered = searchTerm
            ? reports.filter(r =>
                r.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.employee.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : reports;

        setReportData(filtered);
    };

const exportEmployeePDF = (report) => {
  const doc = new jsPDF();
  const employee = report.employee;
  const stats = report.stats;
  const assignments = report.assignments;

  if (!employee) {
    alert('❌ No employee data available');
    return;
  }

  try {
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Employee Performance Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 30, { align: 'center' });

    // Employee Info
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 50, 190, 50, 'F');
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Employee Information', 15, 60);

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Name: ${employee.fullName || 'N/A'}`, 15, 70);
    doc.text(`Email: ${employee.email || 'N/A'}`, 15, 77);
    doc.text(`Position: ${employee.position || 'N/A'}`, 15, 84);
    doc.text(`Phone: ${employee.phone || 'N/A'}`, 15, 91);

    // Statistics
    let yPos = 115;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Performance Statistics', 15, yPos);
    
    yPos += 10;
    doc.setFillColor(59, 130, 246);
    doc.rect(15, yPos, 45, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text((stats?.total || 0).toString(), 37.5, yPos + 13, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Total', 37.5, yPos + 20, { align: 'center' });

    doc.setFillColor(249, 115, 22);
    doc.rect(65, yPos, 45, 25, 'F');
    doc.setFontSize(20);
    doc.text((stats?.pending || 0).toString(), 87.5, yPos + 13, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Pending', 87.5, yPos + 20, { align: 'center' });

    doc.setFillColor(234, 179, 8);
    doc.rect(115, yPos, 45, 25, 'F');
    doc.setFontSize(20);
    doc.text((stats?.inProgress || 0).toString(), 137.5, yPos + 13, { align: 'center' });
    doc.setFontSize(9);
    doc.text('In Progress', 137.5, yPos + 20, { align: 'center' });

    doc.setFillColor(34, 197, 94);
    doc.rect(165, yPos, 35, 25, 'F');
    doc.setFontSize(20);
    doc.text((stats?.completed || 0).toString(), 182.5, yPos + 13, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Completed', 182.5, yPos + 20, { align: 'center' });

    // Completion Rate
    yPos += 35;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Completion Rate: ${stats?.completionRate || 0}%`, 15, yPos);

    // Progress bar
    yPos += 5;
    doc.setDrawColor(200);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos, 180, 8, 'FD');
    
    const progressWidth = (180 * (stats?.completionRate || 0)) / 100;
    const rate = stats?.completionRate || 0;
    if (rate >= 80) doc.setFillColor(34, 197, 94);
    else if (rate >= 50) doc.setFillColor(234, 179, 8);
    else doc.setFillColor(239, 68, 68);
    
    if (progressWidth > 0) {
      doc.rect(15, yPos, progressWidth, 8, 'F');
    }

    // Assignments Details (Manual Table)
    yPos += 20;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Assignment Details', 15, yPos);
    
    yPos += 10;

    if (assignments && assignments.length > 0) {
      // Table Header
      doc.setFillColor(59, 130, 246);
      doc.rect(10, yPos, 190, 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('#', 15, yPos + 7);
      doc.text('Name', 25, yPos + 7);
      doc.text('Phone', 65, yPos + 7);
      doc.text('Company', 100, yPos + 7);
      doc.text('Position', 140, yPos + 7);
      doc.text('Status', 175, yPos + 7);

      yPos += 10;

      // Table Body
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);

      assignments.forEach((a, index) => {
        // Check if need new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        // Zebra striping
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(10, yPos, 190, 8, 'F');
        }

        doc.text((index + 1).toString(), 15, yPos + 6);
        doc.text((a.candidate?.name || 'N/A').substring(0, 15), 25, yPos + 6);
        doc.text(a.candidate?.phone || 'N/A', 65, yPos + 6);
        doc.text((a.candidate?.company || 'N/A').substring(0, 15), 100, yPos + 6);
        doc.text((a.candidate?.position || 'N/A').substring(0, 12), 140, yPos + 6);
        
        // Status with color
        const status = a.status === 'completed' ? 'Completed' : 
                       a.status === 'in_progress' ? 'In Progress' : 'Pending';
        if (a.status === 'completed') doc.setTextColor(34, 197, 94);
        else if (a.status === 'in_progress') doc.setTextColor(234, 179, 8);
        else doc.setTextColor(249, 115, 22);
        
        doc.text(status, 175, yPos + 6);
        doc.setTextColor(0, 0, 0);

        yPos += 8;
      });
    } else {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(11);
      doc.text('No assignments found for this employee.', 15, yPos + 10);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(`Page ${i} of ${pageCount}`, 105, pageHeight - 10, { align: 'center' });
      doc.text('Confidential Report', 15, pageHeight - 10);
      doc.text('HR System', 195, pageHeight - 10, { align: 'right' });
    }

    // Save
    const fileName = `${employee.fullName.replace(/\s+/g, '-')}-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    console.log('✅ PDF saved successfully:', fileName);
    alert('✅ PDF exported successfully!');
    
  } catch (error) {
    console.error('❌ PDF Error:', error);
    alert(`❌ Error creating PDF: ${error.message}`);
  }
};




    const exportAllPDF = () => {
        const doc = new jsPDF();

        // Title Page
        doc.setFillColor(59, 130, 246);
        doc.rect(0, 0, 210, 297, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(32);
        doc.setFont(undefined, 'bold');
        doc.text('Complete Performance', 105, 120, { align: 'center' });
        doc.text('Report', 105, 135, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 160, { align: 'center' });
        doc.text(`Total Employees: ${reportData.length}`, 105, 170, { align: 'center' });

        // Add new page for summary
        doc.addPage();

        // Summary Statistics
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Overall Summary', 14, 20);

        const totalStats = {
            totalAssignments: reportData.reduce((sum, r) => sum + r.stats.total, 0),
            totalCompleted: reportData.reduce((sum, r) => sum + r.stats.completed, 0),
            totalInProgress: reportData.reduce((sum, r) => sum + r.stats.inProgress, 0),
            totalPending: reportData.reduce((sum, r) => sum + r.stats.pending, 0),
        };
        totalStats.overallRate = totalStats.totalAssignments > 0
            ? Math.round((totalStats.totalCompleted / totalStats.totalAssignments) * 100)
            : 0;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        let yPos = 35;

        doc.text(`Total Employees: ${reportData.length}`, 14, yPos);
        yPos += 8;
        doc.text(`Total Assignments: ${totalStats.totalAssignments}`, 14, yPos);
        yPos += 8;
        doc.text(`Completed: ${totalStats.totalCompleted}`, 14, yPos);
        yPos += 8;
        doc.text(`In Progress: ${totalStats.totalInProgress}`, 14, yPos);
        yPos += 8;
        doc.text(`Pending: ${totalStats.totalPending}`, 14, yPos);
        yPos += 8;
        doc.text(`Overall Completion Rate: ${totalStats.overallRate}%`, 14, yPos);

        // Summary Table
        yPos += 15;
        const summaryTableData = reportData.map(r => [
            r.employee.fullName,
            r.employee.email,
            r.stats.total,
            r.stats.pending,
            r.stats.inProgress,
            r.stats.completed,
            `${r.stats.completionRate}%`
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Employee', 'Email', 'Total', 'Pending', 'In Progress', 'Completed', 'Rate']],
            body: summaryTableData,
            theme: 'grid',
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 45 },
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 20, halign: 'center' },
                6: { cellWidth: 15, halign: 'center' }
            }
        });

        // Save
        doc.save(`Complete-Performance-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const exportToExcel = () => {
        // Summary Sheet
        const summaryData = reportData.map(r => ({
            'Employee Name': r.employee.fullName,
            'Email': r.employee.email,
            'Position': r.employee.position || 'N/A',
            'Phone': r.employee.phone || 'N/A',
            'Department': r.employee.department || 'N/A',
            'Total Assignments': r.stats.total,
            'Pending': r.stats.pending,
            'In Progress': r.stats.inProgress,
            'Completed': r.stats.completed,
            'Completion Rate': `${r.stats.completionRate}%`
        }));

        // Detailed Sheet with all candidate information
        const detailedData = [];
        reportData.forEach(r => {
            r.assignments.forEach(a => {
                detailedData.push({
                    'Employee Name': r.employee.fullName,
                    'Employee Email': r.employee.email,
                    'Employee Position': r.employee.position || 'N/A',
                    'Candidate Name': a.candidate?.name || 'N/A',
                    'Candidate Phone': a.candidate?.phone || 'N/A',
                    'Candidate Email': a.candidate?.email || 'N/A',
                    'Candidate Age': a.candidate?.age || 'N/A',
                    'Candidate Address': a.candidate?.address || 'N/A',
                    'Company': a.candidate?.company || 'N/A',
                    'Position': a.candidate?.position || 'N/A',
                    'Education': a.candidate?.education || 'N/A',
                    'Years of Experience': a.candidate?.yearsOfExperience || 'N/A',
                    'Skills': a.candidate?.skills || 'N/A',
                    'Status': a.status,
                    'Assigned Date': new Date(a.assignedAt).toLocaleDateString(),
                    'Last Updated': a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'N/A'
                });
            });
        });

        // Statistics Sheet
        const statsData = reportData.map(r => ({
            'Employee Name': r.employee.fullName,
            'Total Assignments': r.stats.total,
            'Completed': r.stats.completed,
            'In Progress': r.stats.inProgress,
            'Pending': r.stats.pending,
            'Completion Rate': `${r.stats.completionRate}%`,
            'Performance': r.stats.completionRate >= 80 ? 'Excellent' :
                r.stats.completionRate >= 50 ? 'Good' : 'Needs Improvement'
        }));

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Add Summary sheet
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Employee Summary');

        // Add Detailed sheet
        const wsDetailed = XLSX.utils.json_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(wb, wsDetailed, 'Complete Details');

        // Add Statistics sheet
        const wsStats = XLSX.utils.json_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, wsStats, 'Statistics');

        // Save
        XLSX.writeFile(wb, `Complete-Report-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const viewEmployeeDetails = (report) => {
        setSelectedEmployee(report);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg font-bold">Loading reports...</p>
                </div>
            </div>
        );
    }

    const totalStats = {
        totalAssignments: reportData.reduce((sum, r) => sum + r.stats.total, 0),
        totalCompleted: reportData.reduce((sum, r) => sum + r.stats.completed, 0),
        totalInProgress: reportData.reduce((sum, r) => sum + r.stats.inProgress, 0),
        totalPending: reportData.reduce((sum, r) => sum + r.stats.pending, 0),
        overallRate: 0
    };
    totalStats.overallRate = totalStats.totalAssignments > 0
        ? Math.round((totalStats.totalCompleted / totalStats.totalAssignments) * 100)
        : 0;

    return (
        <div >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <FileText size={32} />
                            Performance Reports
                        </h1>
                        <p className="text-blue-200/70 mt-1">Employee performance analysis and detailed statistics</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportAllPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-bold"
                        >
                            <Download size={18} />
                            Export All PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all font-bold"
                        >
                            <FileSpreadsheet size={18} />
                            Export Excel
                        </button>
                        <button
                            onClick={loadData}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-bold"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Overall Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{reportData.length}</h3>
                        <p className="text-sm text-blue-200/80">Total Employees</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{totalStats.totalAssignments}</h3>
                        <p className="text-sm text-blue-200/80">Total Assignments</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                <Clock size={20} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{totalStats.totalPending}</h3>
                        <p className="text-sm text-blue-200/80">Pending</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <AlertCircle size={20} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{totalStats.totalInProgress}</h3>
                        <p className="text-sm text-blue-200/80">In Progress</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{totalStats.overallRate}%</h3>
                        <p className="text-sm text-white/80">Completion Rate</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Search employee name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-xl font-black text-white">📊 Employee Reports ({reportData.length})</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-black text-white">
                                        Employee
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        Pending
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        In Progress
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        Completed
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        Rate
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        Performance
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <FileText size={48} className="text-white/30 mx-auto mb-4" />
                                            <p className="text-white/50 text-lg">No data available</p>
                                        </td>
                                    </tr>
                                ) : (
                                    reportData.map((report) => (
                                        <tr key={report.employee.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <User size={20} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{report.employee.fullName}</p>
                                                        <p className="text-sm text-blue-200/70">{report.employee.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-500/20 text-blue-300 rounded-full font-bold border border-blue-500/50">
                                                    {report.stats.total}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-500/20 text-orange-300 rounded-full font-bold border border-orange-500/50">
                                                    {report.stats.pending}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-yellow-500/20 text-yellow-300 rounded-full font-bold border border-yellow-500/50">
                                                    {report.stats.inProgress}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-green-500/20 text-green-300 rounded-full font-bold border border-green-500/50">
                                                    {report.stats.completed}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${report.stats.completionRate >= 80
                                                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                                        : report.stats.completionRate >= 50
                                                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                                                            : 'bg-red-500/20 text-red-300 border border-red-500/50'
                                                    }`}>
                                                    {report.stats.completionRate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    {report.stats.completionRate >= 80 ? (
                                                        <>
                                                            <CheckCircle size={20} className="text-green-400" />
                                                            <span className="text-sm font-bold text-green-400">Excellent</span>
                                                        </>
                                                    ) : report.stats.completionRate >= 50 ? (
                                                        <>
                                                            <TrendingUp size={20} className="text-yellow-400" />
                                                            <span className="text-sm font-bold text-yellow-400">Good</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle size={20} className="text-red-400" />
                                                            <span className="text-sm font-bold text-red-400">Needs Improvement</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => viewEmployeeDetails(report)}
                                                        className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/50"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            console.log('📄 Exporting PDF for:', report.employee.fullName);
                                                            console.log('📊 Report Data:', report);
                                                            console.log('📋 Assignments:', report.assignments);
                                                            console.log('📈 Stats:', report.stats);

                                                            // Check if data is valid
                                                            if (!report || !report.employee) {
                                                                alert('❌ Error: No employee data found!');
                                                                return;
                                                            }

                                                            // Export PDF
                                                            exportEmployeePDF(report);
                                                        }}
                                                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/50"
                                                        title="Export PDF"
                                                    >
                                                        <Download size={18} />
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

                {/* Report Summary */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">📋 Report Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-blue-200/70">Generated Date:</span>
                            <span className="font-bold text-white">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-blue-200/70">Total Employees:</span>
                            <span className="font-bold text-white">{reportData.length}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-blue-200/70">Total Assignments:</span>
                            <span className="font-bold text-white">{totalStats.totalAssignments}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-blue-200/70">Overall Completion:</span>
                            <span className="font-bold text-green-400">{totalStats.overallRate}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Details Modal */}
            {showDetailsModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-6xl w-full border border-white/20 shadow-2xl my-8" style={{ marginTop: "475px" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                <User size={28} />
                                Employee Details & Assignments
                            </h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Employee Info */}
                        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                            <h4 className="text-lg font-bold text-white mb-4">Employee Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <User size={18} className="text-blue-400" />
                                    <div>
                                        <p className="text-xs text-blue-200/70">Name</p>
                                        <p className="text-white font-bold">{selectedEmployee.employee.fullName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <Mail size={18} className="text-purple-400" />
                                    <div>
                                        <p className="text-xs text-blue-200/70">Email</p>
                                        <p className="text-white font-bold text-sm">{selectedEmployee.employee.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <Briefcase size={18} className="text-green-400" />
                                    <div>
                                        <p className="text-xs text-blue-200/70">Position</p>
                                        <p className="text-white font-bold">{selectedEmployee.employee.position || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <Phone size={18} className="text-orange-400" />
                                    <div>
                                        <p className="text-xs text-blue-200/70">Phone</p>
                                        <p className="text-white font-bold">{selectedEmployee.employee.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <Building size={18} className="text-pink-400" />
                                    <div>
                                        <p className="text-xs text-blue-200/70">Department</p>
                                        <p className="text-white font-bold">{selectedEmployee.employee.department || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <TrendingUp size={18} className="text-yellow-400" />
                                    <div>
                                        <p className="text-xs text-blue-200/70">Completion Rate</p>
                                        <p className="text-white font-bold">{selectedEmployee.stats.completionRate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/50">
                                <p className="text-blue-300 text-sm mb-1">Total</p>
                                <p className="text-3xl font-black text-white">{selectedEmployee.stats.total}</p>
                            </div>
                            <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/50">
                                <p className="text-orange-300 text-sm mb-1">Pending</p>
                                <p className="text-3xl font-black text-white">{selectedEmployee.stats.pending}</p>
                            </div>
                            <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/50">
                                <p className="text-yellow-300 text-sm mb-1">In Progress</p>
                                <p className="text-3xl font-black text-white">{selectedEmployee.stats.inProgress}</p>
                            </div>
                            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/50">
                                <p className="text-green-300 text-sm mb-1">Completed</p>
                                <p className="text-3xl font-black text-white">{selectedEmployee.stats.completed}</p>
                            </div>
                        </div>

                        {/* Assignments List */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h4 className="text-lg font-bold text-white mb-4">Assigned Candidates ({selectedEmployee.assignments.length})</h4>
                            <div className="max-h-96 overflow-y-auto space-y-3">
                                {selectedEmployee.assignments.length === 0 ? (
                                    <p className="text-center text-white/50 py-8">No assignments found</p>
                                ) : (
                                    selectedEmployee.assignments.map((assignment, index) => (
                                        <div key={assignment.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{assignment.candidate?.name || 'N/A'}</p>
                                                        <p className="text-sm text-blue-200/70">{assignment.candidate?.position || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.status === 'completed'
                                                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                                        : assignment.status === 'in_progress'
                                                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                                                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                                                    }`}>
                                                    {assignment.status === 'pending' && '⏳ Pending'}
                                                    {assignment.status === 'in_progress' && '🔄 In Progress'}
                                                    {assignment.status === 'completed' && '✅ Completed'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-blue-400" />
                                                    <span className="text-blue-200/80">{assignment.candidate?.phone || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-purple-400" />
                                                    <span className="text-blue-200/80 truncate">{assignment.candidate?.email || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} className="text-green-400" />
                                                    <span className="text-blue-200/80">{assignment.candidate?.company || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                                                <span className="text-blue-200/60">
                                                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                                </span>
                                                {assignment.candidate?.address && (
                                                    <div className="flex items-center gap-1 text-blue-200/60">
                                                        <MapPin size={12} />
                                                        <span>{assignment.candidate.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => exportEmployeePDF(selectedEmployee)}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Export Employee Report PDF
                            </button>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportsPage;
