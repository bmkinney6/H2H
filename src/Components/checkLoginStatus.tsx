// checkLoginStatus.ts
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

export const checkLoginStatus = async (): Promise<{
  isLoggedIn: boolean;
  username?: string;
}> => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/verifyToken/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        return { isLoggedIn: true, username: response.data.username };
      }
    } catch (error) {
      console.error("Token verification failed", error);
    }
  }
  return { isLoggedIn: false };
};
