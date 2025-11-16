import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, Users, UserCheck, BarChart3, File, Bell } from 'lucide-react';
import SidebarItem from './SidebarItem';
import IconImage from '../../photos/icon10.png';

function Sidebar({ currentPage, setCurrentPage, candidatesCount, unreadNotifications = 0 }) {
  // State للوقت الديناميكي
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    })
  );

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // دالة Logout داخل المكون
  const handleLogout = () => {
    sessionStorage.removeItem('employee');
    window.location.href = '/';
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
<div className="flex items-center gap-3 flex-row-reverse">
  <img
    src={IconImage}
    alt="Logo"
    className="w-10 h-10 object-cover rounded-full shadow-xl"
  />
  <div>
    <h1 className="text-xl font-black text-white text-left">Nexploy</h1>
    <p className="text-xs text-blue-200/70">Recruitment System</p>
  </div>

</div>

      </div>

      {/* Navigation Menu - بس الأزرار */}
      <nav className="flex-1 p-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
          badge={candidatesCount} 
        />
        
        <SidebarItem 
          icon={<UserCheck size={20} />} 
          label="Employees" 
          active={currentPage === 'employees'} 
          onClick={() => setCurrentPage('employees')} 
        />
        
        {/* 🔥 زر الإشعارات مع Badge أحمر متحرك */}
        <SidebarItem 
          icon={<Bell size={20} />} 
          label="Notifications" 
          active={currentPage === 'notifications'} 
          onClick={() => setCurrentPage('notifications')} 
          badge={unreadNotifications}
          badgeColor={unreadNotifications > 0 ? 'red' : null}
          animated={unreadNotifications > 0}
        />
        
        <SidebarItem 
          icon={<BarChart3 size={20} />} 
          label="Summary Report" 
          active={currentPage === 'summary'} 
          onClick={() => setCurrentPage('summary')} 
        />
        
        <SidebarItem 
          icon={<File size={20} />} 
          label="Report" 
          active={currentPage === 'Report'} 
          onClick={() => setCurrentPage('Report')} 
        />
      </nav>

      {/* Footer - التاريخ والـ Logout - بره الـ nav */}
      <div className="p-4 border-t border-white/0">
<div className="flex  w-[210px] h-[170px] flex-col items-center -gap-5 -p-1 bg-gradient-to-r from-slate-700/30 to-slate-900/40 rounded-2xl border border-white/20 shadow-lg ">
          {/* Date Details */}
          <div className="flex flex-col space-y-0.5 text-center mt-5">
            <span className="text-xs text-blue-200 uppercase tracking-wider">
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </span>
            <span className="text-sm font-semibold text-white">
              {new Date().toLocaleDateString("en-US", { month: "long" })}
            </span>
            <span className="text-2xl font-bold text-white">
              {new Date().getDate()}
            </span>
            <span className="text-sm text-blue-200">
              {new Date().getFullYear()}
            </span>
          </div>

          <hr className="w-full border-t border-white/20 my-2" />

          {/* Time Details داينمك */}
          <div className="flex items-center justify-center w-full text-center">
            <span className="text-xs text-blue-300 font-medium tracking-wider">
              {time}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-3 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;