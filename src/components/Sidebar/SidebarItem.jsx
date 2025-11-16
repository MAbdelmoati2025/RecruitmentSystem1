import React from 'react';

function SidebarItem({ icon, label, active, onClick, badge, badgeColor, animated }) {
  // تحديد لون الـ Badge
  const getBadgeClass = () => {
    if (badgeColor === 'red') {
      return 'bg-red-500 text-white shadow-lg shadow-red-500/50';
    }
    return 'bg-white/20 text-white';
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {/* label الأول */}
      <span className="flex-1 text-left font-bold text-sm">{label}</span>

      {/* icon بعده */}
      {icon}

      {/* badge لو موجود */}
      {badge > 0 && (
        <span 
          className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeClass()} ${
            animated ? 'animate-pulse' : ''
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default SidebarItem;