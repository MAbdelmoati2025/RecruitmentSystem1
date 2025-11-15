import React from 'react';

const EmployeeSidebarItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-white/20 shadow-lg shadow-white/10 text-white'
          : 'text-blue-100 hover:bg-white/10 hover:text-white'
      }`}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
            {item.label}
          </span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-blue-200 mt-0.5">{item.description}</p>
        )}
      </div>
    </button>
  );
};

export default EmployeeSidebarItem;