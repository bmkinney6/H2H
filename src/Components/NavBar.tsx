import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Index.css";
import LogoutButton from "./LogoutButton.tsx";
import { ACCESS_TOKEN } from "../constants";

type Notification = {
  id: number;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
};

function NavBar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const response = await axios.get("http://localhost:8000/api/notifications/?limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Fetched notifications:", response.data); // Debugging
          setNotifications(response.data.filter((n) => !n.is_read)); // Only show unread notifications
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();

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

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handlePlayerClick = () => {
    navigate("/scout");
  };

  const handleDraftClick = () => {
    navigate("/draft");
  };

  const handleCreateLeagueClick = () => {
    navigate("/create-league");
  };

  const handleLeagueClick = () => {
    navigate("/leagues");
  };

  const handleSearchLeaguesClick = () => {
    navigate("/search-leagues");
  };

  const handleMyLeaguesClick = () => {
    navigate("/my-leagues");
  };

  const handleUserClick = () => {
    navigate("/user");
  };

  const handleViewAllNotifications = () => {
    navigate("/inbox");
  };

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    await axios.post(`http://localhost:8000/api/notifications/${id}/read/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id)); // Remove from dropdown
  };

  return (
    <nav className="navbar fixed-top navbar-expand-sm navbar-dark">
      <div className="container-fluid">
        <a href="#" className="navbar-brand mb-0 h1">
          <img
            className="d-inline-block align-top"
            src="/H2HLogo.jpg"
            width={30}
            height={30}
            alt="Logo"
          />
          Head To Head
        </a>
        <button
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          className="navbar-toggler"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a href="#" className="nav-link active" onClick={handleHomeClick}>
                Home
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Features
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a href="#" className="dropdown-item">
                    Betting
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={handleCreateLeagueClick}
                  >
                    Create League
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={handleSearchLeaguesClick}
                  >
                    Search Leagues
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={handleMyLeaguesClick}
                  >
                    My Leagues
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    Room for more features!
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handlePlayerClick}>
                Players
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleDraftClick}>
                Draft
              </a>
            </li>
          </ul>
        </div>
        <form className="d-flex">
          <input type="text" className="form-control nav-search my-auto" />
          <button type="submit" className="btn btn-primary my-auto ms-2">
            Search
          </button>
        </form>
        <div className="d-flex align-items-center">
          {/* Notifications Dropdown */}
          <div className="dropdown mx-2">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Notifications
            </button>
            <ul className="dropdown-menu">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="dropdown-item"
                    onClick={() => {
                      if (notification.link) {
                        window.open(notification.link, "_blank");
                      }
                      markAsRead(notification.id);
                    }}
                  >
                    <span className="notification-text">{notification.message}</span>
                  </li>
                ))
              ) : (
                <li className="dropdown-item">No notifications</li>
              )}
              <li>
                <button
                  className="dropdown-item text-primary"
                  onClick={handleViewAllNotifications}
                >
                  View All
                </button>
              </li>
            </ul>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

function NavBarPre() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <nav className="navbar fixed-top navbar-expand-sm navbar-dark">
      <div className="container-fluid">
        <a href="#" className="navbar-brand mb-0 h1">
          <img
            className="d-inline-block align-top"
            src="/H2HLogo.jpg"
            width={30}
            height={30}
            alt="Logo"
          />
          Head To Head
        </a>
        <button
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          className="navbar-toggler"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a href="#" className="nav-link active" onClick={handleHomeClick}>
                Home
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Features
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a href="#" className="dropdown-item">
                    Betting
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    League
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    Create League
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    Room for more features!
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                About
              </a>
            </li>
          </ul>
        </div>
        <form className="d-flex">
          <input type="text" className="form-control me-2 my-auto" />
          <button type="submit" className="btn btn-primary my-auto">
            Search
          </button>
        </form>
        <div className="ms-2">
          <button
            className="btn btn-outline-primary me-2 my-auto"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            className="btn btn-primary me-2 my-auto"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export { NavBarPre, NavBar };