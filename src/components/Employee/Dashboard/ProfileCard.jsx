import React from 'react';
import { User, Mail, Phone, Calendar, Award, Briefcase } from 'lucide-react';

const ProfileCard = ({ employee, assignments }) => {
  const joinDate = employee?.createdAt 
    ? new Date(employee.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A';

  const totalCompleted = assignments.filter(a => 
    a.status === 'Qualified' || a.status === 'Hired'
  ).length;

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">{employee?.name || 'Employee'}</h2>
            <p className="text-blue-100 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {employee?.email || 'N/A'}
            </p>
            <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4" />
              {employee?.phone || 'N/A'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
            <p className="text-xs text-blue-100 mb-1">Member Since</p>
            <p className="text-sm font-semibold flex items-center gap-2 justify-end">
              <Calendar className="w-4 h-4" />
              {joinDate}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-blue-200" />
            <p className="text-xs text-blue-200">Total Assignments</p>
          </div>
          <p className="text-2xl font-bold">{assignments.length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-200" />
            <p className="text-xs text-green-200">Completed</p>
          </div>
          <p className="text-2xl font-bold">{totalCompleted}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-yellow-200" />
            <p className="text-xs text-yellow-200">Success Rate</p>
          </div>
          <p className="text-2xl font-bold">
            {assignments.length > 0 
              ? ((totalCompleted / assignments.length) * 100).toFixed(0)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;