import React, { useState, useEffect, ReactNode } from "react";
import AuthContext from "./AuthContext";
import { checkLoginStatus } from "./checkLoginStatus";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);    // State to track login status

  useEffect(() => {
    const verifyLoginStatus = async () => { // Check login status on component mount
      const { isLoggedIn } = await checkLoginStatus();
      setIsLoggedIn(isLoggedIn);
    };

    verifyLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
