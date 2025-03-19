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

/**
 * Fetch detailed player information based on a search term.
 * @param name - The name of the player to search for.
 * @param API_URL - The base API URL.
 * @returns A promise resolving to an array of Player objects.
 */
export const fetchPlayerInfo = async (
  name: string,
  API_URL: string
): Promise<Player[]> => {
  const token = localStorage.getItem(ACCESS_TOKEN); // Get the token from localStorage
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

/**
 * Fetch the top ten players based on a search term, excluding already-picked players.
 * @param API_URL - The base API URL.
 * @param name - The search term for player names.
 * @param draftPicks - An array of already-picked players.
 * @returns A promise resolving to an array of Player objects.
 */
export const fetchTopTenPlayers = async (
  API_URL: string,
  name: string = "", // Add name parameter with default value
  draftPicks: any[] = [] // Add draftPicks parameter to exclude already-picked players
): Promise<Player[]> => {
  const token = localStorage.getItem(ACCESS_TOKEN); // Get the token from localStorage
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
      }
    );

    // Exclude already-picked players
    const pickedPlayerIds = draftPicks.map((pick) => pick.player_id);
    return response.data.TopTen.filter(
      (player: Player) => !pickedPlayerIds.includes(player.id)
    );
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