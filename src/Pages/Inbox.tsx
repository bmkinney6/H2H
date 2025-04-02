import { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import "../Styles/Index.css";

type Notification = {
  id: number;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
};

export default function Inbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        const response = await axios.get("http://localhost:8000/api/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      }
    };

    fetchNotifications();

    // Establish WebSocket connection
    const ws = new WebSocket(`ws://${window.location.host}/ws/notifications/`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [data, ...prev]); // Add new notification to the list
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    await axios.post(`http://localhost:8000/api/notifications/${id}/read/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAsUnread = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    await axios.post(`http://localhost:8000/api/notifications/${id}/unread/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
    );
  };

  const deleteNotification = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    await axios.delete(`http://localhost:8000/api/notifications/${id}/delete/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="inbox-container">
      <div className="inbox-title">
        <h1>Inbox</h1>
      </div>
      <div className="notifications-list">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${
                  notification.is_read ? "read" : "unread"
                }`}
              >
                <p
                  className="notification-text"
                  onClick={() => {
                    if (notification.link) {
                      window.open(notification.link, "_blank");
                    }
                  }}
                >
                  {notification.message}
                </p>
                <div className="notification-actions">
                  {!notification.is_read ? (
                    <button
                      className="mark-read-button"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      className="mark-unread-button"
                      onClick={() => markAsUnread(notification.id)}
                    >
                      Mark as Unread
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the `onClick` for the list item
                      deleteNotification(notification.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notifications">No notifications</p>
        )}
      </div>
    </div>
  );
}