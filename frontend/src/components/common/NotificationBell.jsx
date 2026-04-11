import { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle, XCircle, Calendar, Ticket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.filter(n => !n.read_at).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'purchase': return <Ticket className="size-4 text-green-500" />;
      case 'reminder': return <Calendar className="size-4 text-blue-500" />;
      case 'approval': return <Users className="size-4 text-purple-500" />;
      default: return <Bell className="size-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
      >
        {unreadCount > 0 ? <BellRing className="size-5" /> : <Bell className="size-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="size-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 hover:bg-gray-50 transition ${!notif.read_at ? 'bg-blue-50' : ''}`}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                      </div>
                      {!notif.read_at && (
                        <button onClick={() => markAsRead(notif.id)} className="text-xs text-green-600 hover:text-green-700">
                          <CheckCircle className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-2 border-t text-center">
              <Link to="/notifications" className="text-xs text-green-600 hover:text-green-700">View all</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
