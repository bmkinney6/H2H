import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext"; // Adjust the import path as necessary
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; // Adjust the import path as necessary

const Logout: React.FC = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsLoggedIn(false); // Update the login state
    navigate("/home"); // Navigate to the login page or any other page
  };

  return (
    <button
      onClick={handleLogout}
      className="justify-content-center btn btn-danger my-auto"
    >
      Logout
    </button>
  );
};

export default Logout;
