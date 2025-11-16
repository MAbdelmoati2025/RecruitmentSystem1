import { Home, ClipboardList, Bell, User, LogOut, Clock, Calendar } from 'lucide-react';
import IconImage from '../../photos/s4.png';
import React, { useState, useEffect } from 'react';

function Sidebar({ employee, stats, activeView, setActiveView, unreadNotifications, handleLogout }) {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = () => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  // Format date
  const formatDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={IconImage}
            alt="Logo"
            className="w-12 h-12 object-cover rounded-full shadow-xl"
          />
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm">{employee?.fullName}</h3>
            <p className="text-blue-200/60 text-xs">{employee?.position}</p>
          </div>
        </div>

        {/* Quick Stats in Sidebar */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-blue-200/60 text-xs mb-1">Total Tasks</p>
            <p className="text-white font-black text-xl">{stats.total}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-blue-200/60 text-xs mb-1">Completed</p>
            <p className="text-green-400 font-black text-xl">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
            : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
            }`}
        >
          <Home size={20} />
          <span className="font-bold text-sm">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveView('assignments')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'assignments'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
            : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
            }`}
        >
          <ClipboardList size={20} />
          <span className="font-bold text-sm">My Assignments</span>
        </button>

        <button
          onClick={() => setActiveView('notifications')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'notifications'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
            : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
            }`}
        >
          <Bell size={20} />
          <span className="font-bold text-sm">Notifications</span>
          {unreadNotifications > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {unreadNotifications}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveView('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'profile'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
            : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
            }`}
        >
          <User size={20} />
          <span className="font-bold text-sm">My Profile</span>
        </button>
      </nav>

      {/* Date and Time Section */}
      <div className="px-4 pb-4 space-y-2">
        {/* Date Display */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-300" size={16} />
            <span className="text-blue-200/60 text-xs font-bold">TODAY</span>
          </div>
          <p className="text-white font-black text-sm">
            {formatDate()}
          </p>
        </div>

        {/* Time Display */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-yellow-300 animate-pulse" size={16} />
            <span className="text-blue-200/60 text-xs font-bold">CURRENT TIME</span>
          </div>
          <p className="text-white font-black text-lg tracking-wider">
            {formatTime()}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;