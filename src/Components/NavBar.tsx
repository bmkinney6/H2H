import { useNavigate } from "react-router-dom";
import "../Styles/Index.css";
import LogoutButton from "./LogoutButton.tsx";

function NavBar() {
  const navigate = useNavigate();

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
    navigate("/leagues"); // Navigate to leagues listing page
  };

  const handleSearchLeaguesClick = () => {
    navigate("/search-leagues"); // Navigate to search leagues page
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
                  <a href="#" className="dropdown-item" onClick={handleLeagueClick}>
                    View Leagues
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item" onClick={handleCreateLeagueClick}>
                    Create League
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item" onClick={handleSearchLeaguesClick}>
                    Search Leagues
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
          <input type="text" className="form-control me-2" />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <LogoutButton />
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
          <input type="text" className="form-control me-2" />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <div className="ms-2">
          <button
            className="btn btn-outline-primary me-2"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            className="btn btn-primary me-2"
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
