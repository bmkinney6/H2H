function NavBar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container-fluid">
        <a href="#" className="navbar-brand mb-0 h1">
          <img //replace with our logo!
            className="d-inline-block align-top"
            src="src/assets/H2HLogo.jpg"
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
              <a href="#" className="nav-link active">
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
                    Feature #1
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    Feature #2
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    Feature #3
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Pricing
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
          <button className="btn btn-outline-primary me-2">Login</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
