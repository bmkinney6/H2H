import { useNavigate, useLocation } from "react-router-dom";
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
// NavBar component
function NavBar() {
  const navigate = useNavigate();
  const location = useLocation(); // Track page changes
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currency, setCurrency] = useState<number | null>(null); // State for user currency
  const [isFeaturesHovered, setIsFeaturesHovered] = useState(false); // Track hover state

  const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, ""); // Ensure no trailing slash


  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/notifications/?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.filter((n) => !n.is_read));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  const fetchCurrency = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/user/info/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userCurrency = response.data.profile?.currency; // Access the currency field
        console.log("userCurrency", userCurrency);
        if (userCurrency !== undefined) {
          setCurrency(parseFloat(userCurrency)); // Ensure the currency is parsed as a number
        } else {
          console.error("Currency field is missing in the API response.");
          setCurrency(0); // Default to 0 if currency is missing
        }
      } catch (error) {
        console.error("Error fetching user currency:", error);
        setCurrency(0); // Default to 0 in case of an error
      }
    }
  };
  // Refresh notifications when the page changes
  useEffect(() => {
    fetchNotifications();
  }, [location]);

  useEffect(() => {
    fetchCurrency();
  }, [location]); // Ensure this runs only once when the component mounts
  
  const handleCreateLeagueClick = () => navigate("/create-league");
  const handleSearchLeaguesClick = () => navigate("/search-leagues");
  const handleMyLeaguesClick = () => navigate("/my-leagues");
  const handleUserScoutClick = () => navigate("/user-search");
  const handleViewAllNotifications = () => navigate("/inbox");

  return (
    <>
      {/* Shadow overlay */}
      {isFeaturesHovered && (
        <div
          className="page-overlay"
          onMouseLeave={() => setIsFeaturesHovered(false)}
        ></div>
      )}

      <nav
        className={`navbar fixed-top navbar-expand-sm navbar-dark ${
          isFeaturesHovered ? "navbar-extended" : ""
        }`}
        onMouseLeave={() => setIsFeaturesHovered(false)} // Reset hover state when leaving the navbar
      >
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
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={() => navigate("/home")}>
                  Home
                </a>
              </li>
              <li
                className="nav-item"
                onMouseEnter={() => setIsFeaturesHovered(true)} // Extend navbar when hovering "Features"
              >
                <a href="#" className="nav-link">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={() => navigate("/scout")}>
                  Players
                </a>
              </li>
            </ul>
          </div>
          
        

          <div className="d-flex align-items-center">
            {/* Currency Display */}
            <div className="currency-display d-flex align-items-center mx-3">
              <img
                src="/dollar.png" // Path to your currency icon
                alt="Currency"
                width={20}
                height={20}
                className="me-2"
              />
              <span className="text-white">{currency !== null ? `$${currency}` : "Loading..."}</span>
            </div>
            {/* Notifications Dropdown */}
            <div className="dropdown mx-2 mb-3">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Notifications
              </button>
                <ul className="dropdown-menu notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="dropdown-item"
                      onClick={() => {
                        if (notification.link) {
                          window.open(notification.link, "_blank");
                        }
                      }}
                    >
                      <span className="notification-text">{notification.message}</span>
                      <div className="notification-separator"></div>

                    </li>
                    
                  ))
                ) : (
                  <li className="dropdown-item">No notifications</li>
                )}
                <li>
                  <a href="/inbox" className="view-all-link">
                    View All
                  </a>
                </li>
              </ul>
            </div>
            <LogoutButton />
            <div className="profile-display d-flex align-items-center mx-3">
              <img
                  src="/ProfileDefault.png" // Path to your currency icon
                  alt="Currency"
                  width={40}
                  height={40}
                  className="me-2"
                  onClick={() => navigate("/user")}
              />
            </div>
          </div>
        </div>
        {isFeaturesHovered && (
          <div className="features-extended-bar">
            <ul className="features-extended-links">
              <li>
                <a
                  href="#"
                  className="extended-link"
                  onClick={handleCreateLeagueClick}
                >
                  Create League
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="extended-link"
                  onClick={handleSearchLeaguesClick}
                >
                  Search Leagues
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="extended-link"
                  onClick={handleMyLeaguesClick}
                >
                  My Leagues
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="extended-link"
                  onClick={handleUserScoutClick}
                >
                  User Search
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
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