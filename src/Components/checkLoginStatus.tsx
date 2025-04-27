import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

// Function to check login status of user
export const checkLoginStatus = async (): Promise<{
  isLoggedIn: boolean;
  username?: string;
}> => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  // Check if token exists in local storage, if not, user is not logged in.
  if (token) {
    try {
      const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/verifyToken/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (response.status === 200) {
        return { isLoggedIn: true, username: response.data.username };
      }
    } catch {
      // Clear token if verification fails
      localStorage.removeItem(ACCESS_TOKEN);
    }
  }
  return { isLoggedIn: false };
};