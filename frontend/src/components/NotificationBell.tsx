import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../core/api';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    api<{ unreadCount: number }>('/notifications/unread-count')
      .then((data) => setUnreadCount(data.unreadCount))
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <Link to="/notifications" className="notification-bell" aria-label={unreadCount && unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}>
      <span aria-hidden="true">🔔</span>
      {unreadCount != null && unreadCount > 0 && <span className="badge-dot" aria-hidden="true" />}
    </Link>
  );
}
