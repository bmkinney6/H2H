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
        try {
          const response = await axios.get("http://localhost:8000/api/notifications/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNotifications(response.data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      await axios.post(`http://localhost:8000/api/notifications/${id}/read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAsUnread = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      await axios.post(`http://localhost:8000/api/notifications/${id}/unread/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
    } catch (err) {
      console.error("Error marking notification as unread:", err);
    }
  };

  const deleteNotification = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      await axios.delete(`http://localhost:8000/api/notifications/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleInviteResponse = async (leagueId: number, userResponse: "accept" | "decline", notificationId: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    try {
      const url = `http://localhost:8000/api/leagues/${leagueId}/invite-response/${userResponse}/`;
      console.log(`DEBUG: Sending POST request to ${url}`);
      const res = await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("DEBUG: Response data:", res.data);
      deleteNotification(notificationId); // Remove the notification after processing
    } catch (err) {
      console.error("DEBUG: Error processing invite response:", err);
    }
  };

  const extractLeagueId = (link: string | undefined): number => {
    if (!link) {
      console.error("DEBUG: Notification link is missing or invalid.");
      return 0; // Default to 0 if the link is invalid
    }
    const parts = link.split("/");
    const leagueId = parseInt(parts[3], 10); // Extract the leagueId from the link
    if (isNaN(leagueId)) {
      console.error("DEBUG: Failed to parse leagueId from link:", link);
      return 0;
    }
    return leagueId;
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
                <p className="notification-text">{notification.message}</p>
                {notification.message.includes("invited to join the league") && (
                  <div className="notification-actions">
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleInviteResponse(
                          extractLeagueId(notification.link),
                          "accept",
                          notification.id
                        )
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleInviteResponse(
                          extractLeagueId(notification.link),
                          "decline",
                          notification.id
                        )
                      }
                    >
                      Decline
                    </button>
                  </div>
                )}
                <div className="notification-actions">
                  {!notification.is_read ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => markAsUnread(notification.id)}
                    >
                      Mark as Unread
                    </button>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
}