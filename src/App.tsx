import { useContext } from "react";
import { NavBar, NavBarPre } from "./Components/NavBar.tsx";
import About from "./Pages/about.tsx";
import { Home, HomePre } from "./Pages/home.tsx";
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
import PlayerDetail from "./Pages/PlayerDetail.tsx"; // New page to show player details
import Scout from "./Pages/Scout.tsx";
import AuthContext from "./Components/AuthContext";
import Draft from "./Pages/Draft.tsx"; // Adjust the import path as necessary
import CreateLeaguePage from "./Pages/CreateLeaguePage";


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <div>
        {isLoggedIn ? <NavBar /> : <NavBarPre />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <HomePre />} />
          <Route path="/about" element={<About />} />
          <Route path="/draft" element={<Draft />} />
          <Route
            path="/scout"
            element={
              <ProtectedRoute>
                <Scout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scout/player/:id"
            element={
              <ProtectedRoute>
                <PlayerDetail />
              </ProtectedRoute>
            }
          />
           <Route
            path="/create-league"
            element={
              <ProtectedRoute>
                <CreateLeaguePage />
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
