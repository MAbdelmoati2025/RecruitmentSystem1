import React, { useState } from 'react';
import { Filter, Play, X, Calendar, Clock, MapPin, Briefcase, GraduationCap, Users, TrendingUp, Phone, Settings, Award, Target } from 'lucide-react';
import API_URL from '../../config/api';

function CampaignFilters({ candidates, employees, onAssign, onClose }) {
    const [filters, setFilters] = useState({
        // Age Filters
        ageMin: '',
        ageMax: '',

        // Location Filters
        address: '',
        city: '',

        // Professional Filters
        company: '',
        position: '',
        education: '',
        experienceLevel: 'all',

        // Time Filters
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',

        // Campaign Settings
        callPriority: 'normal',
        maxCandidatesPerEmployee: 10,
        maxCandidatesPerEmployeeTeam: 100,
        campaignName: '',

        // Phone Filters
        phonePrefix: '',
        hasWhatsApp: false
    });

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filteredCount, setFilteredCount] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [assignmentMode, setAssignmentMode] = useState('single');
    const [employeeCandidateCounts, setEmployeeCandidateCounts] = useState({});

    // 🆕 State for custom employee limits
    const [customEmployeeLimits, setCustomEmployeeLimits] = useState({});

    const toggleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev => {
            if (prev.includes(employeeId)) {
                // Remove employee and their limit
                const newLimits = { ...customEmployeeLimits };
                delete newLimits[employeeId];
                setCustomEmployeeLimits(newLimits);
                return prev.filter(id => id !== employeeId);
            } else {
                // Add employee with default limit
                setCustomEmployeeLimits(prev => ({
                    ...prev,
                    [employeeId]: 100 // Default limit
                }));
                return [...prev, employeeId];
            }
        });
    };

    // 🆕 Update individual employee limit
    const updateEmployeeLimit = (employeeId, limit) => {
        setCustomEmployeeLimits(prev => ({
            ...prev,
            [employeeId]: parseInt(limit) || 0
        }));
    };

    // Filter candidates based on all criteria
    const getFilteredCandidates = () => {
        return candidates.filter(candidate => {
            // Age Filter
            if (filters.ageMin && candidate.age < parseInt(filters.ageMin)) return false;
            if (filters.ageMax && candidate.age > parseInt(filters.ageMax)) return false;

            // Location Filters
            if (filters.address && !candidate.address?.toLowerCase().includes(filters.address.toLowerCase())) return false;
            if (filters.city && !candidate.address?.toLowerCase().includes(filters.city.toLowerCase())) return false;

            // Professional Filters
            if (filters.company && !candidate.company?.toLowerCase().includes(filters.company.toLowerCase())) return false;
            if (filters.position && !candidate.position?.toLowerCase().includes(filters.position.toLowerCase())) return false;
            if (filters.education && !candidate.education?.toLowerCase().includes(filters.education.toLowerCase())) return false;

            // Experience Level Filter
            if (filters.experienceLevel !== 'all') {
                const expLevel = candidate.experienceLevel?.toLowerCase();
                if (expLevel !== filters.experienceLevel) return false;
            }

            // Phone Prefix Filter
            if (filters.phonePrefix && !candidate.phone?.startsWith(filters.phonePrefix)) return false;

            return true;
        });
    };

    // Update filtered count whenever filters change
    React.useEffect(() => {
        setFilteredCount(getFilteredCandidates().length);
    }, [filters, candidates]);

    // 🆕 Calculate total max assignments for custom mode
    const getTotalCustomLimit = () => {
        return Object.values(customEmployeeLimits).reduce((sum, limit) => sum + limit, 0);
    };

    const handleRunCampaign = async () => {
        // 1️⃣ Validations
        if (assignmentMode === 'single' && !selectedEmployee) {
            alert('⚠️ Please select an employee first!');
            return;
        }

        if (assignmentMode === 'team' && employees.length === 0) {
            alert('⚠️ No employees available!');
            return;
        }

        if (assignmentMode === 'custom' && selectedEmployees.length === 0) {
            alert('⚠️ Please select at least one employee!');
            return;
        }

        if (!filters.campaignName.trim()) {
            alert('⚠️ Please enter a campaign name!');
            return;
        }

        // 2️⃣ Get filtered candidates
        const filtered = getFilteredCandidates();

        if (filtered.length === 0) {
            alert('❌ No candidates match your filters!');
            return;
        }

        // 3️⃣ Create assignments based on mode
        let assignments = [];

        if (assignmentMode === 'single') {
            // Single employee
            const toAssign = filtered.slice(0, filters.maxCandidatesPerEmployee);
            assignments = toAssign.map(c => ({
                employeeId: selectedEmployee.id,
                candidateId: c.id,
                status: 'pending',
                notes: `Campaign: ${filters.campaignName} | Priority: ${filters.callPriority.toUpperCase()}`
            }));
        }
        else if (assignmentMode === 'custom') {
            // 🆕 Custom selection with individual limits
            const selectedEmps = employees.filter(emp => selectedEmployees.includes(emp.id));
            let candidateIndex = 0;

            selectedEmps.forEach(employee => {
                const maxForThisEmployee = customEmployeeLimits[employee.id] || 100;
                const employeeCandidates = filtered.slice(
                    candidateIndex,
                    candidateIndex + maxForThisEmployee
                );

                employeeCandidates.forEach(candidate => {
                    assignments.push({
                        employeeId: employee.id,
                        candidateId: candidate.id,
                        status: 'pending',
                        notes: `Campaign: ${filters.campaignName} | Priority: ${filters.callPriority.toUpperCase()} | Custom Distribution (Max: ${maxForThisEmployee})`
                    });
                });

                candidateIndex += maxForThisEmployee;
            });
        }
        else if (assignmentMode === 'team') {
            // All team with max limit per employee
            const maxPerEmployee = filters.maxCandidatesPerEmployeeTeam;
            let candidateIndex = 0;

            employees.forEach(employee => {
                const employeeCandidates = filtered.slice(
                    candidateIndex,
                    candidateIndex + maxPerEmployee
                );

                employeeCandidates.forEach(candidate => {
                    assignments.push({
                        employeeId: employee.id,
                        candidateId: candidate.id,
                        status: 'pending',
                        notes: `Campaign: ${filters.campaignName} | Priority: ${filters.callPriority.toUpperCase()} | Team Distribution (Max: ${maxPerEmployee})`
                    });
                });

                candidateIndex += maxPerEmployee;
            });
        }

        // 4️⃣ Submit and show success
        try {
            await onAssign(assignments);

            if (assignmentMode === 'single') {
                alert(`✅ Campaign "${filters.campaignName}" launched successfully!\n${assignments.length} candidates assigned to ${selectedEmployee.fullName}`);
            } else if (assignmentMode === 'custom') {
                alert(`✅ Campaign "${filters.campaignName}" launched successfully!\n${assignments.length} candidates distributed among ${selectedEmployees.length} selected employees`);
            } else if (assignmentMode === 'team') {
                alert(`✅ Campaign "${filters.campaignName}" launched successfully!\n${assignments.length} candidates distributed among ${employees.length} team members`);
            }

            onClose();
        } catch (error) {
            alert('❌ Failed to launch campaign');
        }
    };

    const clearFilters = () => {
        setFilters({
            ageMin: '',
            ageMax: '',
            address: '',
            city: '',
            company: '',
            position: '',
            education: '',
            experienceLevel: 'all',
            startTime: '',
            endTime: '',
            startDate: '',
            endDate: '',
            callPriority: 'normal',
            maxCandidatesPerEmployee: 10,
            maxCandidatesPerEmployeeTeam: 100,
            campaignName: '',
            phonePrefix: '',
            hasWhatsApp: false
        });
        setSelectedEmployee(null);
        setSelectedEmployees([]);
        setCustomEmployeeLimits({});
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md -translate-y-5 flex items-center justify-center z-50 p-4 overflow-y-auto ">
            <div className="bg-gradient-to-br from-slate-900 translate-y-8 via-purple-900 to-slate-900 rounded-3xl max-w-5xl w-full border-2 border-purple-500/30 shadow-2xl my-8">
                {/* 🎨 Enhanced Header */}
                <div className="relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
                    <div className="relative flex items-center justify-between p-8 border-b border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg animate-pulse">
                                <Target size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight">Campaign Control (Mo3ti)</h2>
                                <p className="text-sm text-blue-200/80 mt-1">Configure, Filter & Launch Your Recruitment Campaign</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white/10 rounded-xl transition-all hover:rotate-90 duration-300"
                        >
                            <X size={28} className="text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                    {/* 📊 Campaign Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Users size={24} className="text-blue-400" />
                                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Total Pool</span>
                            </div>
                            <div className="text-3xl font-black text-white">{candidates.length}</div>
                            <div className="text-xs text-blue-200/70 mt-1">Available Candidates</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Filter size={24} className="text-green-400" />
                                <span className="text-xs font-bold text-green-300 uppercase tracking-wider">Filtered</span>
                            </div>
                            <div className="text-3xl font-black text-white">{filteredCount}</div>
                            <div className="text-xs text-green-200/70 mt-1">Matching Criteria</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Award size={24} className="text-purple-400" />
                                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Team</span>
                            </div>
                            <div className="text-3xl font-black text-white">{employees.length}</div>
                            <div className="text-xs text-purple-200/70 mt-1">Available Employees</div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp size={24} className="text-orange-400" />
                                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">Match Rate</span>
                            </div>
                            <div className="text-3xl font-black text-white">
                                {candidates.length > 0 ? Math.round((filteredCount / candidates.length) * 100) : 0}%
                            </div>
                            <div className="text-xs text-orange-200/70 mt-1">Filter Efficiency</div>
                        </div>
                    </div>

                    {/* 🎯 Campaign Details */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                                <TrendingUp size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Campaign Identity</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="text-red-400">*</span>
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Senior Tech Recruitment - Q1 2024"
                                    value={filters.campaignName}
                                    onChange={(e) => setFilters({ ...filters, campaignName: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Call Priority Level</label>
                                <select
                                    value={filters.callPriority}
                                    onChange={(e) => setFilters({ ...filters, callPriority: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold cursor-pointer hover:bg-white/15 transition-all"
                                >
                                    <option value="high" style={{ backgroundColor: '#1e293b', color: 'white' }}>🔴 High Priority - Urgent</option>
                                    <option value="normal" style={{ backgroundColor: '#1e293b', color: 'white' }}>🟡 Normal Priority - Standard</option>
                                    <option value="low" style={{ backgroundColor: '#1e293b', color: 'white' }}>🟢 Low Priority - Flexible</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 👥 Age Range */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                <Users size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Age Demographics</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Minimum Age</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 22"
                                    value={filters.ageMin}
                                    onChange={(e) => setFilters({ ...filters, ageMin: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Maximum Age</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 45"
                                    value={filters.ageMax}
                                    onChange={(e) => setFilters({ ...filters, ageMax: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 📍 Location Filters */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                                <MapPin size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Geographic Targeting</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Address/Region</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Cairo, Nasr City, 5th Settlement"
                                    value={filters.address}
                                    onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">City</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Cairo, Alexandria, Giza"
                                    value={filters.city}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 💼 Professional Criteria */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                                <Briefcase size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Professional Qualifications</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Company</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Google, Microsoft"
                                    value={filters.company}
                                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Position</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Software Engineer"
                                    value={filters.position}
                                    onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Education Level</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Bachelor, Master"
                                    value={filters.education}
                                    onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Experience Level</label>
                                <select
                                    value={filters.experienceLevel}
                                    onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold cursor-pointer hover:bg-white/15 transition-all"
                                >
                                    <option value="all" style={{ backgroundColor: '#1e293b', color: 'white' }}>All Levels</option>
                                    <option value="junior" style={{ backgroundColor: '#1e293b', color: 'white' }}>🟢 Junior (0-2 years)</option>
                                    <option value="mid" style={{ backgroundColor: '#1e293b', color: 'white' }}>🟡 Mid-Level (2-5 years)</option>
                                    <option value="senior" style={{ backgroundColor: '#1e293b', color: 'white' }}>🔴 Senior (5+ years)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ⏰ Time Schedule */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                                <Clock size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Campaign Schedule</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Start Date</label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-500 font-medium cursor-pointer hover:bg-white/15 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">End Date</label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-500 font-medium cursor-pointer hover:bg-white/15 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Start Time</label>
                                <input
                                    type="time"
                                    value={filters.startTime}
                                    onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-500 font-medium cursor-pointer hover:bg-white/15 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">End Time</label>
                                <input
                                    type="time"
                                    value={filters.endTime}
                                    onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-500 font-medium cursor-pointer hover:bg-white/15 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 📞 Contact Filters */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                                <Phone size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Contact Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Phone Prefix Filter</label>
                                <select
                                    value={filters.phonePrefix}
                                    onChange={(e) => setFilters({ ...filters, phonePrefix: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-bold cursor-pointer hover:bg-white/15 transition-all"
                                >
                                    <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>All Prefixes</option>
                                    <option value="+20" style={{ backgroundColor: '#1e293b', color: 'white' }}>🇪🇬 Egypt (+20)</option>
                                    <option value="010" style={{ backgroundColor: '#1e293b', color: 'white' }}>📱 Vodafone (010)</option>
                                    <option value="011" style={{ backgroundColor: '#1e293b', color: 'white' }}>📱 Etisalat (011)</option>
                                    <option value="012" style={{ backgroundColor: '#1e293b', color: 'white' }}>📱 Orange (012)</option>
                                    <option value="015" style={{ backgroundColor: '#1e293b', color: 'white' }}>📱 WE (015)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Max Candidates (Single Mode)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={filters.maxCandidatesPerEmployee}
                                    onChange={(e) => setFilters({ ...filters, maxCandidatesPerEmployee: parseInt(e.target.value) || 10 })}
                                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500 focus:bg-white/15 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 🎯 ASSIGNMENT MODE - ENHANCED */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500/30 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl animate-pulse">
                                <Settings size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">Distribution Strategy</h3>
                        </div>

                        {/* Assignment Mode Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-white mb-4">Select Assignment Mode</label>
                            <select
                                value={assignmentMode}
                                onChange={(e) => {
                                    setAssignmentMode(e.target.value);
                                    setSelectedEmployee(null);
                                    setSelectedEmployees([]);
                                    setCustomEmployeeLimits({});
                                }}
                                className="w-full px-6 py-5 from-white/10 to-white/5 border-2 border-white/30 rounded-2xl text-white focus:outline-none focus:border-orange-500 font-black text-lg cursor-pointer bg-transparent transition-all shadow-lg"
                            >
                                <option value="single" style={{ backgroundColor: '#1e293b', color: 'white' }}>
                                    👤 Single Employee - Assign to one specific person
                                </option>
                                <option value="custom" style={{ backgroundColor: '#1e293b', color: 'white' }}>
                                    👥 Custom Selection - Choose employees with individual limits
                                </option>
                                <option value="team" style={{ backgroundColor: '#1e293b', color: 'white' }}>
                                    🌐 All Team - Distribute equally among all employees
                                </option>
                            </select>
                        </div>

                        {/* SINGLE MODE */}
                        {assignmentMode === 'single' && (
                            <div className="space-y-4">
                                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">👤</span>
                                        <span className="font-bold text-blue-300 text-sm">SINGLE EMPLOYEE MODE</span>
                                    </div>
                                    <p className="text-xs text-blue-200/70">
                                        Assign all filtered candidates to one employee (up to max limit)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-3">Select Employee</label>
                                    <select
                                        value={selectedEmployee?.id || ''}
                                        onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === parseInt(e.target.value)))}
                                        className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold cursor-pointer hover:bg-white/15 transition-all"
                                    >
                                        <option value="">-- Select an employee --</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id} style={{ backgroundColor: '#1e293b', color: 'white' }}>
                                                {emp.fullName} - {emp.position}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedEmployee && (
                                    <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-5 animate-fadeIn">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">✅</div>
                                            <div className="flex-1">
                                                <div className="font-black text-white text-lg mb-2">{selectedEmployee.fullName}</div>
                                                <div className="text-sm text-green-200">
                                                    <div>Position: <span className="font-bold">{selectedEmployee.position}</span></div>
                                                    <div className="mt-2">Will receive: <span className="font-bold text-white text-lg">{Math.min(filteredCount, filters.maxCandidatesPerEmployee)}</span> candidates</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 🆕 CUSTOM MODE - ENHANCED WITH INDIVIDUAL LIMITS */}
                        {assignmentMode === 'custom' && (
                            <div className="space-y-6">
                                <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">👥</span>
                                        <span className="font-bold text-purple-300 text-sm">CUSTOM SELECTION MODE</span>
                                    </div>
                                    <p className="text-xs text-purple-200/70">
                                        Select multiple employees and set individual limits for each one
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-4">
                                        Select Employees & Set Limits ({selectedEmployees.length} selected)
                                    </label>

                                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar bg-white/5 rounded-2xl p-5 border-2 border-white/20">
                                        {employees.map(emp => {
                                            const isSelected = selectedEmployees.includes(emp.id);
                                            const limit = customEmployeeLimits[emp.id] || 100;

                                            return (
                                                <div
                                                    key={emp.id}
                                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${isSelected
                                                        ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-500 shadow-2xl scale-105'
                                                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-102'
                                                        }`}
                                                >
                                                    <div
                                                        onClick={() => toggleEmployeeSelection(emp.id)}
                                                        className="flex items-center justify-between mb-3"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-black text-white text-lg">{emp.fullName}</div>
                                                            <div className="text-sm text-white/70 mt-1">{emp.position}</div>
                                                        </div>
                                                        <div className="text-4xl">
                                                            {isSelected ? '✅' : '⬜'}
                                                        </div>
                                                    </div>

                                                    {/* 🆕 Individual Limit Input */}
                                                    {isSelected && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="mt-4 pt-4 border-t border-white/20"
                                                        >
                                                            <label className="block text-xs font-bold text-white/80 mb-2">
                                                                Max Candidates for {emp.fullName.split(' ')[0]}
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={limit}
                                                                onChange={(e) => updateEmployeeLimit(emp.id, e.target.value)}
                                                                className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white font-black text-center text-lg focus:outline-none focus:border-green-400 focus:bg-white/30 transition-all"
                                                                placeholder="Enter limit..."
                                                            />
                                                            <div className="text-xs text-center text-white/60 mt-2">
                                                                Will receive up to <span className="font-bold text-green-300">{limit}</span> candidates
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 🆕 Enhanced Distribution Preview */}
                                {selectedEmployees.length > 0 && (
                                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-6 animate-fadeIn">
                                        <div className="flex items-start gap-4">
                                            <div className="text-4xl">📊</div>
                                            <div className="flex-1">
                                                <div className="font-black text-white text-xl mb-4">Distribution Preview</div>

                                                <div className="space-y-3 mb-4">
                                                    {selectedEmployees.map(empId => {
                                                        const emp = employees.find(e => e.id === empId);
                                                        const limit = customEmployeeLimits[empId] || 100;
                                                        return (
                                                            <div key={empId} className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                                                                <span className="font-bold text-white">{emp?.fullName}</span>
                                                                <span className="text-green-300 font-black">Max: {limit}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                                                    <div className="bg-white/10 rounded-xl p-4">
                                                        <div className="text-xs text-white/70 mb-1">Total Max Capacity</div>
                                                        <div className="text-2xl font-black text-white">{getTotalCustomLimit()}</div>
                                                    </div>
                                                    <div className="bg-white/10 rounded-xl p-4">
                                                        <div className="text-xs text-white/70 mb-1">Will Assign</div>
                                                        <div className="text-2xl font-black text-green-400">
                                                            {Math.min(filteredCount, getTotalCustomLimit())}
                                                        </div>
                                                    </div>
                                                </div>

                                                {filteredCount > getTotalCustomLimit() && (
                                                    <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">⚠️</span>
                                                            <div className="text-sm text-yellow-200">
                                                                <span className="font-bold">{filteredCount - getTotalCustomLimit()}</span> candidates will remain unassigned
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TEAM MODE */}
                        {assignmentMode === 'team' && (
                            <div className="space-y-6">
                                <div className="bg-indigo-500/10 border-2 border-indigo-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🌐</span>
                                        <span className="font-bold text-indigo-300 text-sm">ALL TEAM MODE</span>
                                    </div>
                                    <p className="text-xs text-indigo-200/70">
                                        Distribute candidates equally among all employees (with max limit per person)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-3">
                                        Max Candidates Per Employee
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={filters.maxCandidatesPerEmployeeTeam}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            maxCandidatesPerEmployeeTeam: parseInt(e.target.value) || 100
                                        })}
                                        className="w-full px-6 py-5 bg-white/10 border-2 border-white/20 rounded-xl text-white font-black text-2xl text-center focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                                    />
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/50 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">📊</div>
                                        <div className="flex-1">
                                            <div className="font-black text-white text-xl mb-4">Team Distribution</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/10 rounded-xl p-4">
                                                    <div className="text-xs text-white/70 mb-1">Total Employees</div>
                                                    <div className="text-3xl font-black text-white">{employees.length}</div>
                                                </div>
                                                <div className="bg-white/10 rounded-xl p-4">
                                                    <div className="text-xs text-white/70 mb-1">Max per Employee</div>
                                                    <div className="text-3xl font-black text-white">{filters.maxCandidatesPerEmployeeTeam}</div>
                                                </div>
                                                <div className="bg-white/10 rounded-xl p-4">
                                                    <div className="text-xs text-white/70 mb-1">Will Assign</div>
                                                    <div className="text-3xl font-black text-green-400">
                                                        {Math.min(filteredCount, employees.length * filters.maxCandidatesPerEmployeeTeam)}
                                                    </div>
                                                </div>
                                                <div className="bg-white/10 rounded-xl p-4">
                                                    <div className="text-xs text-white/70 mb-1">Available</div>
                                                    <div className="text-3xl font-black text-blue-400">{filteredCount}</div>
                                                </div>
                                            </div>

                                            {filteredCount > (employees.length * filters.maxCandidatesPerEmployeeTeam) && (
                                                <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">⏳</span>
                                                        <div className="text-sm text-yellow-200">
                                                            <span className="font-bold">{filteredCount - (employees.length * filters.maxCandidatesPerEmployeeTeam)}</span> candidates remaining for later
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 📊 Results Summary */}
                    <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-500/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                    <Filter size={28} className="text-blue-400" />
                                    Filtered Results
                                </h4>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-white">{filteredCount}</span>
                                    <span className="text-lg text-blue-200/70">candidates match your criteria</span>
                                </div>
                                <div className="mt-3 text-sm text-blue-200/70">
                                    Out of {candidates.length} total candidates • {Math.round((filteredCount / candidates.length) * 100)}% match rate
                                </div>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-black transition-all shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-3"
                            >
                                <X size={20} />
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🚀 Enhanced Footer */}
                <div className="relative overflow-hidden rounded-[20px] border-t-2 border-white/20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
                    <div className="relative flex items-center justify-between p-8">
                        <button
                            onClick={onClose}
                            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all border-2 border-white/20 hover:scale-105 flex items-center gap-3 text-lg"
                        >
                            <X size={24} />
                            Cancel
                        </button>
                        <button
                            onClick={handleRunCampaign}
                            disabled={
                                (assignmentMode === 'single' && !selectedEmployee) ||
                                (assignmentMode === 'team' && employees.length === 0) ||
                                (assignmentMode === 'custom' && selectedEmployees.length === 0) ||
                                filteredCount === 0 ||
                                !filters.campaignName.trim()
                            }
                            className="px-12 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-110 flex items-center gap-4 text-xl shadow-xl"
                        >
                            <Play size={28} />
                            Launch Campaign
                            {assignmentMode === 'single' && ' (Single)'}
                            {assignmentMode === 'custom' && ` (${selectedEmployees.length} Selected)`}
                            {assignmentMode === 'team' && ' (All Team)'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.8);
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default CampaignFilters;
