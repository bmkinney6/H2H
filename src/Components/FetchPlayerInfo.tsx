import axios, { AxiosError } from "axios";
import { ACCESS_TOKEN } from "../constants.tsx";

type Player = {
  id: number;
  status: string;
  position: string;
  firstName: string;
  lastName: string;
  headshot: string;
  team: string;
  location: string;
  weight: number;
  displayHeight: string;
  age: number;
  experience: string;
  jersey: number;
  yearly_proj: number;
};

export const fetchPlayerInfo = async (
  name: string,
  API_URL: string,
): Promise<Player[]> => {
  const token = localStorage.getItem(ACCESS_TOKEN); // Get the token from localStorage (or wherever it's stored)
  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.get(`${API_URL}/search/?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token here
      },
    });
    return response.data.players; // Return all players
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      // Server responded with a status other than 2xx
      console.error("Error response:", axiosError.response.data);
      console.error("Status code:", axiosError.response.status);
    } else if (axiosError.request) {
      // No response was received
      console.error("Error request:", axiosError.request);
    } else {
      // Something else went wrong
      console.error("Error message:", axiosError.message);
    }
    throw new Error("Failed to fetch player data.");
  }
};

export const fetchTopTenPlayers = async (
  API_URL: string,
  name: string = "", // Add name parameter with default value
): Promise<Player[]> => {
  const token = localStorage.getItem(ACCESS_TOKEN); // Get the token from localStorage (or wherever it's stored)
  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/topTenPlayers/`,
      { name }, // Include the search term in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      },
    );
    return response.data.TopTen; // Return the top ten players
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      // Server responded with a status other than 2xx
      console.error("Error response:", axiosError.response.data);
      console.error("Status code:", axiosError.response.status);
    } else if (axiosError.request) {
      // No response was received
      console.error("Error request:", axiosError.request);
    } else {
      // Something else went wrong
      console.error("Error message:", axiosError.message);
    }
    throw new Error("Failed to fetch top ten players.");
  }
};