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

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { setIsLoggedIn } = useContext(AuthContext);

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/user/token/refresh", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
        setIsLoggedIn(true);
      } else {
        setIsAuthorized(false);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

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
