import React from 'react';
import { Users, Phone, CheckCircle, Clock, TrendingUp, Target } from 'lucide-react';

const EmployeeStats = ({ assignments }) => {
  const totalAssignments = assignments.length;
  const newCandidates = assignments.filter(a => a.status === 'New').length;
  const contacted = assignments.filter(a => a.status === 'Contacted').length;
  const inProgress = assignments.filter(a => a.status === 'In Progress').length;
  const completed = assignments.filter(a => 
    a.status === 'Qualified' || a.status === 'Hired'
  ).length;
  const rejected = assignments.filter(a => a.status === 'Rejected').length;

  const completionRate = totalAssignments > 0 
    ? ((completed / totalAssignments) * 100).toFixed(1) 
    : 0;

  const stats = [
    {
      label: 'Total Assignments',
      value: totalAssignments,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'New Candidates',
      value: newCandidates,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Contacted',
      value: contacted,
      icon: Phone,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeStats;