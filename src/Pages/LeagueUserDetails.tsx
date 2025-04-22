"user client";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import UserDetailsCarousel from "../Components/UserDetailsCarousel";
import MatchupDisplay from "../Components/MatchupDisplay";
import LeagueDisplay from "../Components/LeagueDisplay";
import PlayerSearchList from "../Components/PlayerSearchList";

export type User = {
  id: number;
  username: string;
};

type Player = {
  position: string;
  player: string;
};

export type PlayerFull = {
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

export type League = {
  id: number;
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

export type Team = {
  id: number;
  author: User;
  league: League;
  title: string;
  rank: number;
  wins: number;
  losses: number;
  points_for: number;
  points_against: number;
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
const API_URL1 = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const abPositions = ["QB", "RB", "RB", "WR", "WR", "TE", "FLX", "K", "DEF", "BN", "BN", "BN", "BN", "BN", "BN", "IR", "IR"];
const teamKeys: (keyof Team)[] = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLX", "K", "DEF", "BN1", "BN2", "BN3", "BN4", "BN5", "BN6", "IR1", "IR2"];

const statusMap: Record<string, string> = {
  INJURY_STATUS_OUT: "OUT",
  INJURY_STATUS_IR: "IR",
  INJURY_STATUS_DOUBTFUL: "D",
  INJURY_STATUS_QUESTIONABLE: "Q",
  INJURY_STATUS_PROBABLE: "P",
};
<<<<<<< HEAD
export default function LeagueUserDetails () {
  const { id } = useParams<{ id: string }>();
  const [matchupId, setMatchupId] = useState<number | null>(null); // State for matchupId
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [parentDataLoaded, setParentDataLoaded] = useState(false);
=======
>>>>>>> e13f3c4de67df77876cee6c1af52e660def871a1

export default function LeagueUserDetails({ setGlobalLoading }: { setGlobalLoading: (v: boolean) => void }) {
  const { leagueId, userId } = useParams<{ leagueId: string; userId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [parentDataLoaded, setParentDataLoaded] = useState(false);
  const [matchupReady, setMatchupReady] = useState(false);
  const [permission, setPermission] = useState(false);

  const [week, setWeek] = useState<number | null>(null);
  const [league, setLeague] = useState<League | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [player, setPlayerFull] = useState<Array<PlayerFull>>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  const [myId, setMyId] = useState<number | null>(null);
  const [members, setMembers] = useState<Array<User>>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(team?.title || '');

  const dragPerson = useRef<number | null>(null);
  const dragOverPerson = useRef<number | null>(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchMatchupId = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.get(`/api/league/${id}/user-matchup/`);
        const matchupId = response.data.matchupId; // Ensure this is not null
        setMatchupId(matchupId);
    } catch (error) {
        console.error("Error fetching matchup:", error);
    }
    };

    fetchMatchupId();
  }, [matchupId]);

  useEffect(() => {
    const fullLeague = async () => {

      fetchWeek();
      fetchUserDetails();

      const leagueid = Number(leagueId);
      console.log("League ID:", leagueid);
      if (leagueid) {
        const team = await fetchUserTeam(leagueid);
        setTeam(team);
        setLeague(team.league);
        setMembers(team.league.users);
        setUsername(team.author.username);

        const teamListObject = await fetchPlayerDetails(convertToPlayerArray(team));
        setPlayerFull(teamListObject);
        setParentDataLoaded(true);
      }
    };
    fullLeague();
  }, [leagueId]);

  useEffect(() => {
    setGlobalLoading(true);
  }, []);

  useEffect(() => {
    if (parentDataLoaded && matchupReady) {
      setGlobalLoading(false);
    }
  }, [parentDataLoaded, matchupReady]);

  useEffect(() => {
    if (myId && userId) {
      if (myId !== Number(userId)) {
        setPermission(true);
      }
    }
  }, [userId, myId]);

  const fetchWeek = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    try {
      const response = await axios.get(`${API_URL1}/week`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Week:", response.data);
      setWeek(response.data.week);
      return;
    } catch (err) {
      console.error("Error fetching Week:", err);
      return;
    }
  };

  const fetchPlayerDetails = async (teamList: Array<Player>) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    try {
      const teamListQuery = teamList.map(player => player.player).join(",");
      console.log("Fetching Player Details for:", teamListQuery);
      const response = await axios.get(`${API_URL}/myPlayers?players=${teamListQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Details:", response.data);
      return response.data;
      // =======

      //       const playersWithDefaults = response.data.map((player: PlayerFull) => ({
      //         ...player,
      //         proj_fantasy: player.proj_fantasy ?? 0,
      //         total_fantasy_points: player.total_fantasy_points ?? 0,
      //         pass_yards: player.pass_yards ?? 0,
      //         pass_tds: player.pass_tds ?? 0,
      //         receiving_yards: player.receiving_yards ?? 0,
      //         receiving_tds: player.receiving_tds ?? 0,
      //         rush_yards: player.rush_yards ?? 0,
      //         rush_tds: player.rush_tds ?? 0,
      //         fg_made: player.fg_made ?? 0,
      //         extra_points_made: player.extra_points_made ?? 0,
      //       }));

      //       console.log("Fetched Players with Defaults:", playersWithDefaults);
      //       return playersWithDefaults;
      // >>>>>>> master
      //     } catch (err) {
      //       console.error("Error fetching USER:", err);
      //       return []; // Return an empty array if there's an error
      //     }

      console.log("Fetched USER:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching USER:", err);
      return;
    }
  };




  const fetchUserTeam = async (leagueid: number) => {
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
      .filter(([key]) => key !== "id" && key !== "author" && key !== "league" && key !== "title" && key !== "rank" && key !== 'wins' && key !== 'losses' && key !== 'points_for' && key !== 'points_against') // Exclude metadata fields
      .map(([position, player]) => ({ position, player: String(player) }));
  };

  const swapPlayersCases = () => {
    const allowedPositions = ["Wide Receiver", "Running Back", "Tight End"];
    const index1 = dragPerson.current;
    const index2 = dragOverPerson.current;
    console.log("Swapping players at index:", index1, index2);

    if (index1 === null || index2 === null) return;
    if ((index1 == 6 && (index2 > 8 && index2 < 15) || index2 == 6 && (index1 > 8 && index1 < 15)) && (allowedPositions.includes(player[index1].position) && allowedPositions.includes(player[index2].position))) {
      swapPlayers(index1, index2);
      return;
    }
    else if ((index1 == 6 && (index2 > 8 && index2 < 15)) || (index2 == 6 && (index1 > 8 && index1 < 15))) {
      setError("You can only swap flex players with players that are WR, RB, or TE.");
      setSelected([]);
      return;
    }
    if ((index2 > 8 && index2 < 15) && (index1 > 8 && index1 < 15)) {
      swapPlayers(index1, index2);
      return;
    }

    if (index1 >= 15 || index2 >= 15) {
      if (index1 >= 15 && index2 >= 15) {
        swapPlayers(index1, index2);
        return;
      }
      const targetIndex = index1 >= 15 ? index2 : index1;
      if (player[targetIndex].status === "INJURY_STATUS_IR" || player[targetIndex].status === "INJURY_STATUS_OUT" || player[targetIndex].status === "x") {
        swapPlayers(index1, index2);
        return;
      }
      else {
        setError("Player must be on IR to swap.");
        setSelected([]);
        return;
      }

    }
    if (player[index1].position === player[index2].position) {
      swapPlayers(index1, index2);
    }
    else {
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
    if (!team) {
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

    const key1 = teamKeys[index1] as keyof Omit<Team, "id" | "wins" | "losses" | "points_for" | "points_against" | "author" | "league" | "rank" | "title">;
    const key2 = teamKeys[index2] as keyof Omit<Team, "id" | "wins" | "losses" | "points_for" | "points_against" | "author" | "league" | "rank" | "title">;

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
  // // ========================================== Save to backend when team changes ==============================================
  useEffect(() => {
    saveData()
  }, [team]); // Runs when `team` is updated


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
  // ========================================== Get userId for the current user ==============================================
  const fetchUserDetails = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL1}/api/user/info/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyId(response.data.user.id);
    } catch (err) {
      setError("Failed to fetch user details.");
      console.error("Error fetching user details:", err);
    }
  }

  return (
    <>
      <div className="UserDetailsALL">
        <div className="UserDetailsSearch">
          <UserDetailsCarousel
            tabs={["Matchup", "League Stats", "Search Players"]}
            components={[
              team && league && <MatchupDisplay players={player} team={team} members={members} leagueID={league.id} onReady={() => setMatchupReady(true)} />,
              league && <LeagueDisplay League={league} />,
              <PlayerSearchList />,
            ]}
          />
        </div>
        <div className="UserDetailsWeek">
          WEEK{week}
        </div>
        <div className="UserDetailsList">
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
              <div className="UserDetailsHH2">
                <h3>
                  Managed by: {username} Rank: {team?.rank}
                </h3>
                <button
                  className="UserDetailsTradeBtn"
                  onClick={() => navigate(`/league/${league?.id}/trade`)}>
                  Trade Players
                </button>
              </div>
            </div>

            <div className="UserDetailsParent">
              <div className="UserDetailsTeam">
                <div className="UserDetailsPlayerHeader">
                  <span className="UserDetailsPositionLabel"></span>        {/* 1 - position label */}
                  <span className="UserDetailsPlayerName"></span>           {/* 2 - name */}
                  <span className="UserDetailsPlayerStats">{error && <p className="UserDetailsE">{error}</p>}</span>          {/* 3 - stats */}
                  <span className="UserDetailsPoints">Total</span>          {/* 4 - total points */}
                  <span className="UserDetailsPoints1">Proj</span>           {/* 5 - projected points */}
                  <span className="UserDetailsDrag"></span>                 {/* 6 - drag handle */}
                </div>
                {player.map((player, index) => (
                  <div
                    key={index}
                    className={`UserDetailsPlayerRow ${selected.includes(index)
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
                      {player.status === "Active" && player.position === "Quarterback" && (
                        <>Passing Yards: {player.pass_yards || 0} | Passing TDs: {player.pass_tds || 0}</>
                      )}

                      {player.status === "Active" && player.position === "Running Back" && (
                        <>Rushing Yards: {player.rush_yards || 0} | Rushing TDs: {player.rush_tds || 0}</>
                      )}

                      {player.status === "Active" &&
                        (player.position === "Wide Receiver" || player.position === "Tight End") && (
                          <>Receiving Yards: {player.receiving_yards || 0} | Receiving TDs: {player.receiving_tds || 0}</>
                        )}

                      {player.status === "Active" && player.position === "Place kicker" && (
                        <>Extra Points: {player.extra_points_made || 0} | Field Goals: {player.fg_made || 0}</>
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
            </div>
          </>
        </div>
      </div>
    </>
  );
}  