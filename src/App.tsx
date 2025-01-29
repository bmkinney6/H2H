import NavBar from "./Components/NavBar.tsx";
import About from "./Pages/about.tsx";
import Home from "./Pages/home.tsx";
import Login from "./Pages/login.tsx";
import Register from "./Pages/register.tsx";
import NotFound from "./Pages/notFound.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import "./Styles/Index.css";
import Scout from "./Pages/Scout.tsx";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <Router>
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/*<Route path="/scout" element={<Scout />} />*/}
          <Route
            path="/scout"
            element={
              <ProtectedRoute>
                <Scout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
