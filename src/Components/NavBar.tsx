import { useNavigate } from "react-router-dom";
import "../Styles/Index.css";
import LogoutButton from "./LogoutButton.tsx";

function NavBar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/home"); // Navigate to the login page
  };

  const handlePlayerClick = () => {
    navigate("/scout");
  };

  const handleDraftClick = () => {
    navigate("/draft");
  };
  const handleUserClick = () => {
    navigate("/user");
  };
  return (
    <nav className="navbar fixed-top navbar-expand-sm navbar-dark">
      <div className="container-fluid">
        <a href="#" className="navbar-brand mb-0 h1">
          <img //replace with our logo!
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
        <div className=" d-flex align-items-center">
          <div className="text-center mx-2">
            <img
              src="/ProfilePic.png"
              alt="Profile Icon"
              className="navbar-icon"
              onClick={handleUserClick}
            />
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
    navigate("/login"); // Navigate to the login page
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Navigate to the login page
  };
  const handleHomeClick = () => {
    navigate("/home"); // Navigate to the login page
  };

  const handleAboutClick = () => {
    navigate("/about");
  };

  return (
    <nav className="navbar fixed-top navbar-expand-sm navbar-dark">
      <div className="container-fluid">
        <a href="#" className="navbar-brand mb-0 h1">
          <img //replace with our logo!
            className="d-inline-block align-top"
            src="../../public/H2HLogo.jpg"
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
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleAboutClick}></a>
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
