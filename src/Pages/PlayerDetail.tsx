import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { ACCESS_TOKEN } from "../constants.tsx";

// Define PlayerStats structure (Includes all fields you provided earlier)
type PlayerStats = {
  week: number;
  total_fantasy_points?: number;
  proj_fantasy?: number;
  pass_att?: number;
  completions?: number;
  pass_yards?: number;
  pass_tds?: number;
  ints?: number;
  sacks?: number;
  targets?: number;
  catches?: number;
  receiving_yards?: number;
  avg_receiving_yards_perCatch?: number;
  receiving_tds?: number;
  carrys?: number;
  avg_rush_yards_perCarry?: number;
  rush_yards?: number;
  rush_tds?: number;
  fumbles?: number;
  return_td?: number;
  two_pt_made?: number;
  kick_1_19?: number;
  kick_20_29?: number;
  kick_30_39?: number;
  kick_40_49?: number;
  kick_50?: number;
  fg_made?: number;
  fg_attempts?: number;
  fg_perc?: number;
  extra_points_made?: number;
  extra_points_attempts?: number;
};

// Define Player structure
type Player = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  position: string;
  jersey: number;
  age: number;
  weight: number;
  displayHeight: string;
};

type PlayerNews = {
  headline: string;
  date: string;
  text: string;
};

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]); // ✅ Separate state for stats
  const [playerNews, setPlayerNews] = useState<PlayerNews[]>([]); // ✅ Separate state for stats
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "news">("stats");

  // URLs for player info & stats
  const API_URL_INFO = import.meta.env.VITE_PLAYER_URL;
  const API_URL_STATS = import.meta.env.VITE_PLAYER_STATS_URL;
  const API_URL_NEWS = import.meta.env.VITE_PLAYER_NEWS_URL;

  useEffect(() => {
    const fetchPlayerData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        console.error("No token found");
        setError("User is not authenticated.");
        return;
      }

      try {
        // Fetch Player Details
        const playerResponse = await axios.get(`${API_URL_INFO}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Player Data:", playerResponse.data);
        setPlayer(playerResponse.data.Player); // ✅ Set player data

        // Fetch Player Stats
        const statsResponse = await axios.get(`${API_URL_STATS}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Player Stats Data:", statsResponse.data);
        setPlayerStats(statsResponse.data.Player_stats || []); // ✅ Ensure stats is an array

        // Fetch Player News
        const newsResponse = await axios.get(`${API_URL_NEWS}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Player News Data:", newsResponse.data);
        setPlayerNews(newsResponse.data.Player_news || []); // ✅ Ensure stats is an array

        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Error fetching player data:", axiosError);
        setError("Failed to fetch player data.");
      }
    };

    if (id) fetchPlayerData();
  }, [id, API_URL_INFO, API_URL_STATS, API_URL_NEWS]);

  return (
    <div className="container mx-auto p-4 max-w-screen-xl">
      <h1 className="text-center text-2xl font-bold">Player Details</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {player && (
        <div className="player-info text-center w-full border p-4 mt-4">

          <h3 className="text-xl font-semibold">{`${player.firstName} ${player.lastName}`}</h3>
          <h5>{`Team: ${player.team}`}</h5>
          <h5>{`Position: ${player.position}`}</h5>
          <p>{`Jersey #: ${player.jersey}`}</p>
          <p>{`Age: ${player.age}`}</p>
          <p>{`Weight: ${player.weight}`}</p>
          <p>{`Height: ${player.displayHeight}`}</p>

          {/* Tabs for Stats and News */}
          <div className="flex justify-center mt-4">
            <button
              className={`px-4 py-2 border-b-2 ${
                activeTab === "stats" ? "border-blue-500 font-bold" : "border-gray-300"
              }`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
            <button
              className={`px-4 py-2 border-b-2 ${
                activeTab === "news" ? "border-blue-500 font-bold" : "border-gray-300"
              }`}
              onClick={() => setActiveTab("news")}
            >
              News
            </button>
          </div>

          {/* Stats Section */}
          {activeTab === "stats" && playerStats.length > 0 ? (
            <div className="mt-4 overflow-x-auto w-full">
              <h4 className="text-lg font-semibold">Weekly Stats</h4>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Week</th>
                    <th className="border px-4 py-2">Total Fantasy Pts</th>
                    <th className="border px-4 py-2">Proj. Fantasy Pts</th>
                  
                  {/* Headers for each stat section */}
                  {player?.position === "Quarter Back" && (
                    <>

                      <th className="border px-4 py-2">Pass Att</th>
                      <th className="border px-4 py-2">Completions</th>
                      <th className="border px-4 py-2">Pass Yards</th>
                      <th className="border px-4 py-2">Pass TDs</th>
                      <th className="border px-4 py-2">INTs</th>
                      <th className="border px-4 py-2">Sacks</th>
                      
                      <th className="border px-4 py-2">Rush Yards</th>
                      <th className="border px-4 py-2">Rush TDs</th>
                      <th className="border px-4 py-2">Fumbles</th>
                    </>
                  )}

                  {(player?.position === "Running Back" || player?.position === "Wide Receiver" || player?.position === "Tight End") && (
                    <>
                      <th className="border px-4 py-2">Carries</th>
                      <th className="border px-4 py-2">Rush Yards</th>
                      <th className="border px-4 py-2">Rush TDs</th>

                      <th className="border px-4 py-2">Targets</th>
                      <th className="border px-4 py-2">Receptions</th>
                      <th className="border px-4 py-2">Receiving Yards</th>
                      <th className="border px-4 py-2">Receiving TDs</th>
                    </>
                  )}

                  {player?.position === "Place kicker" && (
                    <>
                      <th className="border px-4 py-2">FG Made</th>
                      <th className="border px-4 py-2">FG Attempts</th>
                      <th className="border px-4 py-2">FG %</th>
                      <th className="border px-4 py-2">Extra Points Made</th>
                    </>
                  )}
                  </tr>
                </thead>

                <tbody>
                  {playerStats.map((stat) => (
                    <tr key={stat.week} className="text-center">
                      <td className="border px-4 py-2">{stat.week}</td>
                      <td className="border px-4 py-2">{stat.total_fantasy_points || "-"}</td>
                      <td className="border px-4 py-2">{stat.proj_fantasy || "-"}</td>

                      {/* QB Passing */}
                      {player?.position === "Quarterback" && (
                        <>
                          <td className="border px-4 py-2">{stat.pass_att || "-"}</td>
                          <td className="border px-4 py-2">{stat.completions || "-"}</td>
                          <td className="border px-4 py-2">{stat.pass_yards || "-"}</td>
                          <td className="border px-4 py-2">{stat.pass_tds || "-"}</td>
                          <td className="border px-4 py-2">{stat.ints || "-"}</td>
                          <td className="border px-4 py-2">{stat.sacks || "-"}</td>
                          <td className="border px-4 py-2">{stat.rush_yards || "-"}</td>
                          <td className="border px-4 py-2">{stat.rush_tds || "-"}</td>
                          <td className="border px-4 py-2">{stat.fumbles || "-"}</td>
                        </>
                      )}

                      {/* RB, WR, TE Rushing & Receiving */}
                      {(player?.position === "Running Back" || player?.position === "Wide Receiver" || player?.position === "Tight End") && (
                        <>
                          <td className="border px-4 py-2">{stat.carrys || "-"}</td>
                          <td className="border px-4 py-2">{stat.rush_yards || "-"}</td>
                          <td className="border px-4 py-2">{stat.rush_tds || "-"}</td>
                          <td className="border px-4 py-2">{stat.targets || "-"}</td>
                          <td className="border px-4 py-2">{stat.catches || "-"}</td>
                          <td className="border px-4 py-2">{stat.receiving_yards || "-"}</td>
                          <td className="border px-4 py-2">{stat.receiving_tds || "-"}</td>
                        </>
                      )}

                      {/* Kicker Stats */}
                      {player?.position === "Place kicker" && (
                        <>
                          <td className="border px-4 py-2">{stat.fg_made || "-"}</td>
                          <td className="border px-4 py-2">{stat.fg_attempts || "-"}</td>
                          <td className="border px-4 py-2">{stat.fg_perc || "-"}</td>
                          <td className="border px-4 py-2">{stat.extra_points_made || "-"}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === "stats" ? (
            <p>No stats available</p>
          ) : null}


          {/* News Section */}
          {activeTab === "news" && playerNews.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Latest News</h4>
              {playerNews.map((news) => (
                <div className="border-b py-2">
                  <h5 className="font-semibold">{news.headline}</h5>
                  <p className="text-sm text-gray-600">{news.date}</p>
                  <p>{news.text}</p>
                </div>
              ))}
            </div>
          ) : activeTab === "news" ? (
            <p>No news available</p>
          ) : null}

          <button onClick={() => navigate("/scout")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Back to Search
          </button>
        </div>
      )}
    </div>
  );
}
