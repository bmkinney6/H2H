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

      console.log("Token Verification Response:", response);
      if (response.status === 200) {
        return { isLoggedIn: true, username: response.data.username };
      }
    } catch (error: any) {
      console.error("Token verification failed", error.response?.data || error.message);
    }
  }
  return { isLoggedIn: false };
};
