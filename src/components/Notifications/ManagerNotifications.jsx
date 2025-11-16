import { Bell, CheckCircle, Clock, User, Trash2, Check, Filter } from 'lucide-react';
import { useState } from 'react';

function ManagerNotifications({ notifications, onMarkAsRead, onMarkAllAsRead, onDelete }) {
  const [filterType, setFilterType] = useState('all');
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const parseMetadata = (metadata) => {
    if (!metadata) return null;
    if (typeof metadata === 'string') {
      try {
        return JSON.parse(metadata);
      } catch (e) {
        console.error('Error parsing metadata:', e);
        return null;
      }
    }
    return metadata;
  };

  // Filter notifications
  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => 
        filterType === 'unread' ? !n.read : n.type === filterType
      );

  // Group notifications by employee
  const groupedByEmployee = filteredNotifications.reduce((acc, notification) => {
    const metadata = parseMetadata(notification.metadata);
    const employeeId = metadata?.employeeId || 'unknown';
    const employeeName = metadata?.employeeName || 'Unknown Employee';
    
    if (!acc[employeeId]) {
      acc[employeeId] = {
        employeeId,
        employeeName,
        notifications: []
      };
    }
    
    acc[employeeId].notifications.push(notification);
    return acc;
  }, {});

  const employeeGroups = Object.values(groupedByEmployee).sort((a, b) => 
    a.employeeName.localeCompare(b.employeeName)
  );

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    completed: notifications.filter(n => n.type === 'task_completed').length,
    today: notifications.filter(n => {
      const notifDate = new Date(n.createdAt);
      const today = new Date();
      return notifDate.toDateString() === today.toDateString();
    }).length,
    employees: employeeGroups.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Bell className="text-yellow-400" size={36} />
            Manager Notifications
          </h1>
          <p className="text-blue-200/70">Track employee achievements and completed tasks</p>
        </div>
        
        {stats.unread > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-5 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl 
                     transition-all duration-200 flex items-center gap-2 border border-green-500/30
                     font-bold"
          >
            <Check size={20} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl 
                      rounded-2xl p-5 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200/70 text-sm mb-1">Total Notifications</p>
              <p className="text-3xl font-black text-white">{stats.total}</p>
            </div>
            <Bell size={40} className="text-blue-300/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl 
                      rounded-2xl p-5 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200/70 text-sm mb-1">Unread</p>
              <p className="text-3xl font-black text-white">{stats.unread}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-black">{stats.unread}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl 
                      rounded-2xl p-5 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200/70 text-sm mb-1">Tasks Completed</p>
              <p className="text-3xl font-black text-white">{stats.completed}</p>
            </div>
            <CheckCircle size={40} className="text-green-300/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl 
                      rounded-2xl p-5 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/70 text-sm mb-1">Today</p>
              <p className="text-3xl font-black text-white">{stats.today}</p>
            </div>
            <Clock size={40} className="text-purple-300/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl 
                      rounded-2xl p-5 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200/70 text-sm mb-1">Active Employees</p>
              <p className="text-3xl font-black text-white">{stats.employees}</p>
            </div>
            <User size={40} className="text-cyan-300/50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={20} className="text-blue-300" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'unread'
                ? 'bg-yellow-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Unread ({stats.unread})
          </button>
          <button
            onClick={() => setFilterType('task_completed')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'task_completed'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Notifications List - Grouped by Employee */}
      <div className="space-y-6">
        {employeeGroups.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
            <Bell size={64} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-xl font-bold">No notifications yet</p>
            <p className="text-white/30 text-sm mt-2">Notifications will appear here when tasks are completed</p>
          </div>
        ) : (
          employeeGroups.map((group) => {
            const employeeStats = {
              total: group.notifications.length,
              unread: group.notifications.filter(n => !n.read).length,
              completed: group.notifications.filter(n => n.type === 'task_completed').length
            };

            return (
              <div key={group.employeeId} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                {/* Employee Header */}
                <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-xl border-b border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/20">
                        <User size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white mb-1">
                          {group.employeeName}
                        </h3>
                        <p className="text-blue-200/70">
                          Employee ID: {group.employeeId}
                        </p>
                      </div>
                    </div>
                    
                    {/* Employee Stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-center px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                        <p className="text-white/60 text-xs mb-1">Total</p>
                        <p className="text-white font-black text-xl">{employeeStats.total}</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                        <p className="text-yellow-200/70 text-xs mb-1">Unread</p>
                        <p className="text-white font-black text-xl">{employeeStats.unread}</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                        <p className="text-green-200/70 text-xs mb-1">Completed</p>
                        <p className="text-white font-black text-xl">{employeeStats.completed}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications for this Employee */}
                <div className="divide-y divide-white/10">
                  {group.notifications.map((notification) => {
                    const metadata = parseMetadata(notification.metadata);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-6 hover:bg-white/5 transition-all duration-200 ${
                          !notification.read ? 'bg-yellow-500/10 border-l-4 border-yellow-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'task_completed'
                              ? 'bg-green-500/20 border-2 border-green-500/50'
                              : 'bg-blue-500/20 border-2 border-blue-500/50'
                          }`}>
                            {notification.type === 'task_completed' ? (
                              <CheckCircle size={28} className="text-green-300" />
                            ) : (
                              <Bell size={28} className="text-blue-300" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Time Badge */}
                            <div className="flex items-center gap-2 mb-2">
                              <Clock size={16} className="text-blue-300" />
                              <span className="text-blue-300 font-bold">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                            </div>

                            {/* Message */}
                            <p className="text-white font-bold text-lg mb-3">
                              {notification.message}
                            </p>

                            {/* Task Details */}
                            {metadata && (
                              <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/10">
                                {metadata.candidateName && (
                                  <div className="flex items-center gap-3">
                                    <User size={16} className="text-purple-300" />
                                    <span className="text-white/70">Client:</span>
                                    <span className="text-white font-bold">
                                      {metadata.candidateName}
                                    </span>
                                  </div>
                                )}
                                
                                {metadata.startTime && (
                                  <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-blue-300" />
                                    <span className="text-white/70">Started at:</span>
                                    <span className="text-white font-bold">
                                      {formatDate(metadata.startTime)}
                                    </span>
                                  </div>
                                )}
                                
                                {metadata.endTime && (
                                  <div className="flex items-center gap-3">
                                    <CheckCircle size={16} className="text-green-300" />
                                    <span className="text-white/70">Completed at:</span>
                                    <span className="text-white font-bold">
                                      {formatDate(metadata.endTime)}
                                    </span>
                                  </div>
                                )}
                                
                                {metadata.startTime && metadata.endTime && (
                                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                                    <Clock size={16} className="text-yellow-300" />
                                    <span className="text-white/70">Duration:</span>
                                    <span className="text-yellow-300 font-black text-lg">
                                      {formatDuration(metadata.startTime, metadata.endTime)}
                                    </span>
                                  </div>
                                )}

                                {metadata.notes && (
                                  <div className="pt-2 border-t border-white/10">
                                    <span className="text-white/70 text-sm">Notes:</span>
                                    <p className="text-white/90 mt-1">{metadata.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Timestamp */}
                            <p className="text-blue-200/50 text-sm mt-3">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="p-3 hover:bg-green-500/20 text-green-300 rounded-xl 
                                         transition-all duration-200 border border-green-500/30"
                                title="Mark as read"
                              >
                                <Check size={20} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this notification?')) {
                                  onDelete(notification.id);
                                }
                              }}
                              className="p-3 hover:bg-red-500/20 text-red-300 rounded-xl 
                                       transition-all duration-200 border border-red-500/30"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                            
                            {!notification.read && (
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ManagerNotifications;