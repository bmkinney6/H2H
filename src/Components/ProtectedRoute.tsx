// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect, ReactNode, useContext, useCallback } from "react";
import AuthContext from "./AuthContext"; // Adjust the import path as necessary

interface ProtectedRouteProps {
  children: ReactNode;
}

interface DecodedToken {
  exp: number;
}
//protected route component to make sure users are logged in before accessing certain pages
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { setIsLoggedIn } = useContext(AuthContext);

  const refreshToken = useCallback(async () => { // Function to refresh the token
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/user/token/refresh", {
        refresh: refreshToken,
      });
      // If the response status is 200, set the new access token
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
        setIsLoggedIn(true);
      }// If the response status is not 200, clear the tokens
      else {
        setIsAuthorized(false);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);
  // Function to check if the user is authorized
  const auth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      setIsLoggedIn(false);
      return;
    }
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    // Check if the token is expired, if so, refresh the token
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
      setIsLoggedIn(true);
    }
  }, [refreshToken, setIsLoggedIn]);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, [auth]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
