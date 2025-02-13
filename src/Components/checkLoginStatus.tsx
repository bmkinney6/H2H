import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

export const checkLoginStatus = async (): Promise<{
  isLoggedIn: boolean;
  username?: string;
}> => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  console.log("Token in checkLoginStatus:", token); // Log token to verify it
  if (token) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/verifyToken/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Token verification response:", response); // Log response from the API
      if (response.status === 200) {
        return { isLoggedIn: true, username: response.data.username };
      }
    } catch (error) {
      console.error("Token verification failed", error); // Log any error
    }
  }
  return { isLoggedIn: false };
};
