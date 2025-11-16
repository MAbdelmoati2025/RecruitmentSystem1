import { User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';

function ProfileView({ employee, stats }) {
  return (
    
    <div className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-black text-white mb-2">My Profile</h1>
        <p className="text-blue-200/70">View and manage your account information</p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{employee?.fullName}</h2>
            <p className="text-blue-200/70 mb-2">{employee?.position || 'Employee'}</p>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold border border-green-500/50">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="p-6 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mail size={20} className="text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-blue-200/70">Email Address</p>
                <p className="text-white font-bold">{employee?.email}</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="p-6 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-orange-300" />
              </div>
              <div>
                <p className="text-xs text-blue-200/70">Phone Number</p>
                <p className="text-white font-bold">{employee?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="p-6 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Briefcase size={20} className="text-green-300" />
              </div>
              <div>
                <p className="text-xs text-blue-200/70">Position</p>
                <p className="text-white font-bold">{employee?.position || 'Employee'}</p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="p-6 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-blue-200/70">Member Since</p>
                <p className="text-white font-bold">
                  {employee?.createdAt
                    ? new Date(employee.createdAt).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-xl font-black text-white mb-4">Performance Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-black text-white mb-1">{stats.total}</p>
              <p className="text-xs text-blue-200/70">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-black text-green-400 mb-1">{stats.completed}</p>
              <p className="text-xs text-blue-200/70">Completed</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-black text-yellow-400 mb-1">{stats.inProgress}</p>
              <p className="text-xs text-blue-200/70">In Progress</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-black text-purple-400 mb-1">{stats.completionRate}%</p>
              <p className="text-xs text-blue-200/70">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;