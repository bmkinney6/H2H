import React, { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import setupAxiosInterceptor from "./Components/axiosInterceptor";
import { NavBar, NavBarPre } from "./Components/NavBar.tsx";
import About from "./Pages/about.tsx";
import { Home, HomePre } from "./Pages/home.tsx";
import Login from "./Pages/login.tsx";
import Loader from "./Components/Loader.tsx";
import Register from "./Pages/register.tsx";
import NotFound from "./Pages/notFound.tsx";
import Inbox from "./Pages/Inbox";
import UserScout from "./Pages/UserScout.tsx";
import UserDetails from "./Pages/UserDetails.tsx";
import Betting from "./Pages/Betting.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import PlayerDetail from "./Pages/PlayerDetail.tsx";
import Scout from "./Pages/Scout.tsx";
import AuthContext from "./Components/AuthContext";
import CreateLeaguePage from "./Pages/CreateLeaguePage";
import SearchLeague from "./Components/SearchLeague";
import LeagueDetail from "./Pages/LeagueDetail";
import LeagueScout from "./Pages/LeagueScout";
import Draft from "./Pages/Draft.tsx";
import UserProfile from "./Pages/User.tsx"; // Adjust the import path as necessary
import MyLeagues from "./Pages/MyLeagues";
import LeagueUserDetails from "./Pages/LeagueUserDetails.tsx";
import Trade from "./Pages/Trade.tsx";

import "./Styles/Index.css";
import "./Styles/LeagueUserDetails.css";

// Logout and RegisterAndLogout components
function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

// AppContent functional component
function AppContent() {
    const navigate = useNavigate(); // Get the navigate function
    const { isLoggedIn } = useContext(AuthContext); // Get login status from AuthContext
    const [globalLoading, setGlobalLoading] = useState(false);

    // Set up Axios interceptor with navigate
    useEffect(() => {
        setupAxiosInterceptor(navigate); // Pass navigate to the interceptor
    }, [navigate]);

    return (
        <>
            <div>
                {isLoggedIn ? <NavBar /> : <NavBarPre />}
                <Loader active={globalLoading} />
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
                        path="/league/:leagueId/matchup/:matchupId/betting"
                        element={
                            <ProtectedRoute>
                                <Betting />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user-search"
                        element={
                            <ProtectedRoute>
                                <UserScout />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/:userId"
                        element={
                            <ProtectedRoute>
                                <UserDetails />
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
                    <Route
                        path="/inbox"
                        element={
                            <ProtectedRoute>
                                <Inbox />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/register" element={<RegisterAndLogout />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/leagues" element={<SearchLeague />} />
                    <Route path="/leagues/:id" element={<LeagueDetail />} />
                    <Route path="/draft/:leagueId" element={<Draft />} />
                    <Route path="/search-leagues" element={<LeagueScout />} />
                    <Route path="/league/:id" element={<LeagueUserDetails />} />
                    <Route
                        path="/league/:id/trade"
                        element={
                            <ProtectedRoute>
                                <Trade />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-leagues"
                        element={<MyLeagues setGlobalLoading={setGlobalLoading} />}
                    />
                    <Route
                        path="/league/:leagueId/:userId"
                        element={
                            <ProtectedRoute>
                                <LeagueUserDetails setGlobalLoading={setGlobalLoading} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent /> {/* The Router wraps AppContent */}
        </Router>
    );
}

export default App;