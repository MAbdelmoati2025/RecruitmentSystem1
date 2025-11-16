import { Bell, ClipboardList, CheckCircle, Trash2, Check } from 'lucide-react';

function NotificationsView({ notifications, onMarkAsRead, onMarkAllAsRead, onDelete }) {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Group notifications - keep only the LATEST one for each type
  const getLatestNotifications = () => {
    // Sort by date (newest first)
    const sorted = [...notifications].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Group by type and keep only the first (latest) one
    const seen = new Set();
    return sorted.filter(notification => {
      if (seen.has(notification.type)) {
        return false;
      }
      seen.add(notification.type);
      return true;
    });
  };

  const uniqueNotifications = getLatestNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Notifications</h1>
          <p className="text-blue-200/70">Stay updated with your latest activities</p>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl 
                     transition-all duration-200 flex items-center gap-2 border border-blue-500/30"
          >
            <Check size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
        {uniqueNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {uniqueNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-white/5 transition-colors ${
                  !notification.read ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* أيقونة النوع */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'assignment'
                      ? 'bg-blue-500/20'
                      : notification.type === 'update'
                      ? 'bg-green-500/20'
                      : 'bg-orange-500/20'
                  }`}>
                    {notification.type === 'assignment' && (
                      <ClipboardList size={20} className="text-blue-300" />
                    )}
                    {notification.type === 'update' && (
                      <CheckCircle size={20} className="text-green-300" />
                    )}
                    {notification.type === 'reminder' && (
                      <Bell size={20} className="text-orange-300" />
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold mb-1">
                      {notification.message}
                    </p>
                    <p className="text-blue-200/60 text-sm">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-2 hover:bg-green-500/20 text-green-300 rounded-lg 
                                 transition-all duration-200"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this notification?')) {
                          onDelete(notification.id);
                        }
                      }}
                      className="p-2 hover:bg-red-500/20 text-red-300 rounded-lg 
                               transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsView;