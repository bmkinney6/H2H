import api from "./api";

interface Game {
  id: string;
  season_type: string;
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  current_play: string;
  week: number;
}
export const getGames = async (): Promise<Game[]> => {
  try {
    const response = await api.get("/games/");
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

export const getGameById = async (id: number): Promise<Game> => {
  try {
    const response = await api.get(`/games/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
};
