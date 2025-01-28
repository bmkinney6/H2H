
import "../Styles/Index.css";

function SideBar() {
  // const navigate = useNavigate();

  return (
    <div className="wrapper">
      <aside id="sidebar">
        <div className="d-flex">
          <button id="toggle-btn" type="button">
            <i className="bi bi-grid"></i>
          </button>
          <div className="siderbar-logo">
            <a href="#" className="logo">
              H2H
            </a>
          </div>
        </div>
          <ul className="sidebar-nav">
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                      <i className="bi bi-user"></i>
                      <span>Profile</span>
                  </a>
              </li>
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                      <i className="bi bi-agenda"></i>
                      <span>Task</span>
                  </a>
              </li>
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link has-dropdown collapsed" data-bs-toggle="collapse"
                     data-bs-target="#auth" aria-expanded="false" aria-controls="auth">
                      <i className="lni lni-shield-2-check"></i>
                      <span>Auth</span>
                  </a>
                  <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                      <li className="sidebar-item">
                          <a href="" className="sidebar-link">Login</a>
                      </li>
                      <li className="sidebar-item">
                          <a href="" className="sidebar-link">Register</a>
                      </li>
                  </ul>
              </li>
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link has-dropdown collapsed" data-bs-toggle="collapse"
                     data-bs-target="#multi" aria-expanded="false" aria-controls="multi">
                      <i className="lni lni-layout-9"></i>
                      <span>Multi Level</span>
                  </a>
                  <ul id="multi" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                      <li className="sidebar-item">
                          <a href="#" className="sidebar-link has-dropdown collapsed" data-bs-toggle="collapse"
                             data-bs-target="#multi-two" aria-expanded="false" aria-controls="multi-two">
                              Two links
                          </a>
                          <ul id="multi-two" className="sidebar-dropdown list-unstyled collapse"
                              data-bs-parent="#multi">
                              <li className="sidebar-item">
                                  <a href="#" className="sidebar-link">Link 1</a>
                              </li>
                              <li className="sidebar-item">
                                  <a href="#" className="sidebar-link">Link 2</a>
                              </li>
                          </ul>
                      </li>
                  </ul>
              </li>
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                      <i className="bi bi-bell"></i>
                      <span>Notification</span>
                  </a>
              </li>
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                      <i className="bi bi-gear"></i>
                      <span>Settings</span>
                  </a>
              </li>
          </ul>
          <div className="sidebar-footer">
              <a href="#" className="sidebar-link">
                  <i className="bi bi-box-arrow-left"></i>
                  <span>Logout</span>
              </a>
          </div>
      </aside>
        <div className="main p-3">

        </div>
    </div>
  );
}

export default SideBar;
