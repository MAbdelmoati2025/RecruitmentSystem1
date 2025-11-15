import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  FileText
} from 'lucide-react';
import EmployeeSidebarItem from './EmployeeSidebarItem';

const EmployeeSidebar = ({ activeView, setActiveView, onLogout, employeeName }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Statistics'
    },
    {
      id: 'assignments',
      label: 'My Assignments',
      icon: Users,
      description: 'View assigned candidates',
      badge: 'active'
    },
    {
      id: 'call-logs',
      label: 'Call History',
      icon: Phone,
      description: 'View call logs'
    },
    {
      id: 'reports',
      label: 'My Reports',
      icon: BarChart3,
      description: 'Performance metrics'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Updates & alerts'
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: Settings,
      description: 'Update your info'
    }
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Employee Portal</h2>
            <p className="text-xs text-blue-200">Recruitment System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
            {employeeName?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{employeeName || 'Employee'}</p>
            <p className="text-xs text-blue-200">Active Status</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <EmployeeSidebarItem
              key={item.id}
              item={item}
              isActive={activeView === item.id}
              onClick={() => setActiveView(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-blue-300">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;