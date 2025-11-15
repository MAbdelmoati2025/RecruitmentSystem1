import React from 'react';
import { LayoutDashboard, Upload, Users, UserCheck, BarChart3 } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { MOCK_EMPLOYEE } from '../../constants/mockData';
import IconImage from '../../photos/icon10.png';

function Sidebar({ currentPage, setCurrentPage, candidatesCount }) {
  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10 -mt-6 mb-2">
        <div className="flex items-center gap-3 mt-3 ">
          <img
            src={IconImage}
            alt="Logo"
            className="w-10 h-10 object-cover rounded-full shadow-xl"
          />
          <div>
            <h1 className="text-xl font-black text-white">Nexploy</h1>
            <p className="text-xs text-blue-200/70">Recruitment System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mb-24">
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
        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Summary Report"
          active={currentPage === 'summary'}
          onClick={() => setCurrentPage('summary')}
        />
        <SidebarItem
          icon={<UserCheck size={20} />}
          label=" Report"
          active={currentPage === 'Report'}
          onClick={() => setCurrentPage('Report')}
        />

        <div className="p-4 border-t border-white/10" style={{ marginTop: "20px" }}>
          <div className="flex flex-col items-center gap-2 p-5 bg-gradient-to-r from-slate-700/30 to-slate-900/40 rounded-2xl border border-white/20 shadow-lg">

            {/* Date Details in vertical layout */}
            <div className="flex flex-col space-y-0.5 text-center">
              <span className="text-xs text-blue-200 uppercase tracking-wider">
                {new Date().toLocaleDateString("en-US", { weekday: "long" })}
              </span>
              <span className="text-sm font-semibold text-white">
                {new Date().toLocaleDateString("en-US", { month: "long" })}
              </span>
              <span className="text-2xl font-bold text-white">{new Date().getDate()}</span>
              <span className="text-sm text-blue-200">{new Date().getFullYear()}</span>
            </div>

            {/* Divider */}
            <hr className="w-full border-t border-white/20 my-2" />

            {/* Time Details */}
            <div className="flex items-center justify-center w-full text-center">
              <span className="text-xs text-blue-300 font-medium tracking-wider">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true
                })}
              </span>
            </div>

          </div>
        </div>




      </nav>


    </aside>
  );
}

export default Sidebar;
