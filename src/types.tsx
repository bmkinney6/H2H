export interface Game {
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
