"user client";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import Loader from "../Components/Loader";
import PlayerSearchList from "../Components/PlayerSearchList";

type User = {
  username: string;
};

type Player = {
  position: string;
  player: string;
};

type PlayerFull = {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  position: string;
  team: string;
  proj_fantasy: number | null;
  total_fantasy_points: number | null;  
  pass_yards: number | null;
  pass_tds: number | null;
  receiving_yards: number | null;
  receiving_tds: number | null;
  rush_yards: number | null;
  rush_tds: number | null;
  fg_made: number | null;
  extra_points_made: number | null;
};

type League = {
  id: string;
  name: string;
  owner: User;
  draft_date: string;
  time_per_pick: number;
  positional_betting: boolean;
  max_capacity: number;
  private: boolean;
  join_code?: string;
  users: Array<User>;
};

type Team = {
  id: number;
  author: User;
  league: League;
  title: string;
  rank: number;
  QB: string;
  RB1: string;
  RB2: string;
  WR1: string;
  WR2: string;
  TE: string;
  FLX: string;
  K: string;
  DEF: string;
  BN1: string;
  BN2: string;
  BN3: string;
  BN4: string;
  BN5: string;
  BN6: string;
  IR1: string;
  IR2: string;
};

const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");
const abPositions = ["QB", "RB", "RB", "WR", "WR", "TE", "FLX", "K", "DEF", "BN", "BN", "BN", "BN", "BN", "BN", "IR", "IR"];
const teamKeys: (keyof Team)[] = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLX", "K", "DEF", "BN1", "BN2", "BN3", "BN4", "BN5", "BN6", "IR1", "IR2"];

const statusMap: Record<string, string> = {
  INJURY_STATUS_OUT: "OUT",
  INJURY_STATUS_IR: "IR",
  INJURY_STATUS_DOUBTFUL: "Doubtful",
  INJURY_STATUS_QUESTIONABLE: "Questionable",
  INJURY_STATUS_PROBABLE: "Probable",
};
export default function LeagueUserDetails () {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [parentDataLoaded, setParentDataLoaded] = useState(false);  

  const [league, setLeague] = useState<League | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [player, setPlayerFull] = useState<Array<PlayerFull>>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(team?.title || '');

  // for saving progress when leaving page
  const location = useLocation();
  const dragPerson = useRef<number | null>(null);
  const dragOverPerson = useRef<number | null>(null);

  useEffect(() => {
    const fullLeague = async () => {
      const leagueid = Number(id);
        if (leagueid) {
          const team = await fetchUserTeam(leagueid); // Call function after both values are available
          setTeam(team);
          console.log("fsdfsd")
          console.log(team)
          setLeague(team.league);
          setUsername(team.author.username);
          const teamListObject = await fetchPlayerDetails(convertToPlayerArray(team));
          setPlayerFull(teamListObject);
          setParentDataLoaded(true);
        }
    };
    fullLeague();
  }, [id]);

  // to deactivate loading screen (content has loaded)  
  useEffect(() => {
    if (parentDataLoaded) {
      setLoading(false);
    }
  }, [parentDataLoaded]);

  const fetchPlayerDetails = async (teamList: Array<Player>) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    try {
      const teamListQuery = teamList.map(player => player.player).join(",");
      console.log("Fetching Player Details for:", teamListQuery);
      console.log("Fetching User from:", `${API_URL}/myPlayers?players=${teamListQuery}`);
      const response = await axios.get(`${API_URL}/myPlayers?players=${teamListQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched USER:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching USER:", err);
      return;
    }
  };

  const fetchUserTeam = async(leagueid: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    try {
      console.log("Fetching User from:", `${API_URL}/${leagueid}/user`);
      const response = await axios.get(`${API_URL}/${leagueid}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched USER:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching USER:", err);
      return;
    } 
  };

  const convertToPlayerArray = (team: Team) => {
    return Object.entries(team)
      .filter(([key]) => key !== "id" && key !== "author" && key !== "league" && key !== "title" && key !== "rank") // Exclude metadata fields
      .map(([position, player]) => ({ position, player: String(player) }));
  };
  
  const swapPlayersCases = () => {
    const allowedPositions = ["Wide Receiver", "Running Back", "Tight End"];
    const index1 = dragPerson.current;
    const index2 = dragOverPerson.current;
    console.log("Swapping players at index:", index1, index2);

    if (index1 === null || index2 === null) return;
    if ((index1 == 6 && (index2 > 8 && index2 < 15) || index2 == 6 && (index1 > 8 && index1 < 15)) && (allowedPositions.includes(player[index1].position) && allowedPositions.includes(player[index2].position))){
      swapPlayers(index1, index2);
      return;
    }
    else if ((index1 == 6 && (index2 > 8 && index2 < 15)) || (index2 == 6 && (index1 > 8 && index1 < 15))){
      setError("You can only swap flex players with players that are WR, RB, or TE.");
      setSelected([]);
      return;
    }
    if ((index2 > 8 && index2 < 15) && (index1 > 8 && index1 < 15)){
      swapPlayers(index1, index2);
      return;
    }

    if (index1 >= 15 || index2 >= 15){
      if(index1 >= 15 && index2 >= 15){
        swapPlayers(index1, index2);
        return;
      }
      const targetIndex = index1 >= 15 ? index2 : index1;
      if(player[targetIndex].status === "INJURY_STATUS_IR" || player[targetIndex].status === "INJURY_STATUS_OUT" || player[targetIndex].status === "x"){
        swapPlayers(index1, index2);
        return;
      }
      else{
        setError("Player must be on IR to swap.");
        setSelected([]);
        return;
      }

    }
    if (player[index1].position === player[index2].position){
      swapPlayers(index1, index2);
    }
    else{
      setError("You can only swap players with the same position.");
      setSelected([]);
    }
  };

    // Function to save data
    const saveData = async () => {
      if (!team) {
          console.warn("No valid team, aborting request.");
          return; // Don't send an empty request
      }
  
      const token = localStorage.getItem(ACCESS_TOKEN);
      const payload = { team };
  
      try {
          const response = await axios.put(`${API_URL}/save-data/`, payload, {
              headers: { 
                  Authorization: `Bearer ${token}`, 
                  "Content-Type": "application/json" 
              },
          });
          console.log("Response:", response.data);
          return response.data;
      } catch (err) {
          console.error("Error saving data:", err ? err : err);
      }
  };
  

  const swapPlayers = (index1: number, index2: number) => {
    if (!team){
      return;
    } 
    const updatedList = [...player];
    [updatedList[index1], updatedList[index2]] = [updatedList[index2], updatedList[index1]];

    const updatedTeam: Team = {
      ...team,
      id: team.id ?? 0, 
      author: team.author ?? {} as User, 
      league: team.league ?? {} as League, 
    };
  
    const key1 = teamKeys[index1] as keyof Omit<Team, "id" | "author" | "league" | "rank" | "title">;
    const key2 = teamKeys[index2] as keyof Omit<Team, "id" | "author" | "league" | "rank" | "title">;
  
    if (typeof updatedTeam[key1] === "string" && typeof updatedTeam[key2] === "string") {
      const temp = updatedTeam[key1] as string;
      updatedTeam[key1] = updatedTeam[key2] as string;
      updatedTeam[key2] = temp;
    }
  
    setPlayerFull(updatedList);
    setTeam(updatedTeam);
    setError(null);
    setSelected([]);
  };

  useEffect(() => {
    saveData()
}, [team]); // Runs when `team` is updated

  // // ========================================== Save to backend when reload, or leave page ==============================================

  // // Function to save data
  // const saveData = useCallback(() => {
  //   if (!team){
  //     console.log(team)
  //   } // Don't save if there's no valid team

  //   console.log("🚀 Saving data before unload/navigation...", team);
  //   try {
  //     const blob = new Blob([JSON.stringify({ team })], {
  //       type: "application/json",
  //     });
  //     // ✅ Use sendBeacon to ensure data is saved before unloading
  //     const result = navigator.sendBeacon(`${API_URL}/save-data`, blob);

  //     console.log("✅ sendBeacon result:", result ? "Sent successfully" : "Failed to send");
  //   } catch (error) {
  //     console.error("❌ Failed to save data:", error);
  //   }
  // }, [team]); 

  // useEffect(() => {
  //   window.addEventListener("beforeunload", saveData);
  //   return () => {
  //     window.removeEventListener("beforeunload", saveData);
  //   };
  // }, [saveData]);

  // // ✅ Save only when navigating away (not on first load)
  // useEffect(() => {
  //   return () => {
  //     if (team) {
  //       saveData();
  //     }
  //   };
  // }, [location.pathname, team]); // ✅ Now depends on `team`
  
  
  // // ========================================== Save to backend when reload, or leave page ==============================================

  // ========================================== Handle temperary save of team.title ==============================================
  const handleSave = () => {
    setIsEditing(false);
    if (team) {
      setTeam({ ...team, title: tempTitle });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };
  
  return (
    <>
      <div className="UserDetailsALL">
        <div className = "UserDetailsSearch">
          <PlayerSearchList
          />
        </div>
        <div className="UserDetailsList">
    
        {/* Show loader until loading is false */}
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="UserDetailsHH">
                {isEditing ? (
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="UserDetailsHH"
                    autoFocus
                  />
                ) : (
                  <div>
                    <h1
                      className="UserDetailsHH"
                      onDoubleClick={() => {
                        console.log("double click");
                        setIsEditing(true);
                      }}
                    >
                      {team?.title ? `${team.title}` : "No Team Name? (Double-Click)"}
                    </h1>
                  </div>
                )}
                <div>
                  <h3 className="">
                    Managed by: {username} Rank: {team?.rank}
                  </h3>
                </div>
              </div>
      
              <div className="UserDetailsParent">
                <div className="UserDetailsTeam">
                  <div className="UserDetailsPlayerHeader">
                    <span className="UserDetailsPositionLabel"></span>        {/* 1 - position label */}
                    <span className="UserDetailsPlayerName"></span>           {/* 2 - name */}
                    <span className="UserDetailsPlayerStats"></span>          {/* 3 - stats */}
                    <span className="UserDetailsPoints">Total</span>          {/* 4 - total points */}
                    <span className="UserDetailsPoints1">Proj</span>           {/* 5 - projected points */}
                    <span className="UserDetailsDrag"></span>                 {/* 6 - drag handle */}
                  </div>
                  {player.map((player, index) => (
                    <div
                      key={index}
                      className={`UserDetailsPlayerRow ${
                        selected.includes(index)
                          ? "border-blue-500 bg-blue-100"
                          : "bg-white"
                      }`}
                      onDragEnter={() => (dragOverPerson.current = index)}
                      onDragEnd={swapPlayersCases}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <span className="UserDetailsPositionLabel">
                        {abPositions[index]}
                      </span>
                      <span className="UserDetailsPlayerName">
                        {player.firstName}
                        {"\u00A0"}
                        {player.lastName}
                        {player.status && !["x", "Active"].includes(player.status)
                          ? ` (${statusMap[player.status] || player.status})`
                          : ""}
                      </span>
                      <span className="UserDetailsPlayerStats">
                        {player.status === "Active" && player.rush_tds != null && player.position === "Quarterback" && (
                          <>Passing Yards: {player.pass_yards} | Passing TDs: {player.pass_tds}</>
                        )}

                        {player.status === "Active" && player.rush_tds != null && player.position === "Running Back" && (
                          <>Rushing Yards: {player.rush_yards} | Rushing TDs: {player.rush_tds}</>
                        )}

                        {player.status === "Active" && player.rush_tds != null &&
                          (player.position === "Wide Receiver" || player.position === "Tight End") && (
                          <>Receiving Yards: {player.receiving_yards} | Receiving TDs: {player.receiving_tds}</>
                        )}

                        {player.status === "Active" && player.rush_tds != null && player.position === "Place kicker" && (
                          <>Extra Points: {player.extra_points_made} | Field Goals: {player.fg_made}</>
                        )}
                      </span>
                      <div className="UserDetailsPointsGroup">
                        <span className="UserDetailsPoints">{player.total_fantasy_points}</span>
                        <span className="UserDetailsPoints1">{player.proj_fantasy}</span>
                      </div>
                      <span
                        className="UserDetailsDrag"
                        draggable
                        onDragStart={() => (dragPerson.current = index)}
                        title="Drag"
                      >
                        ☰
                      </span>
                    </div>
                  ))}
                </div>
                {error && <p className="UserDetailsE">{error}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
  
}  