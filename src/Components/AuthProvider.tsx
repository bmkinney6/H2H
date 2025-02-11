import React, { useState, useEffect, ReactNode } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode"; // Make sure you have jwt-decode installed

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null); // New user state

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: { username: string } = jwtDecode(token);
        setIsLoggedIn(true);
        setUser(decoded.username); // Store username
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
