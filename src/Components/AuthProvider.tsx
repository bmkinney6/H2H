import React, { useState, useEffect, ReactNode } from "react";
import AuthContext from "./AuthContext";
import { checkLoginStatus } from "./checkLoginStatus";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const verifyLoginStatus = async () => {
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
