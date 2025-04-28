"user client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { Team, PlayerFull, User } from '../Pages/LeagueUserDetails';
import "../Styles/Matchup.css";


type PlayerStat = {
  id: string;
  fullName: string;
  proj_fantasy: number | null;
  total_fantasy_points: number | null;
};

type FantasyTeam = {
  id: number;
  title: string;
  rank: number;
  author: string; // or use `User` type if you have it
  QB: PlayerStat | null;
  RB1: PlayerStat | null;
  RB2: PlayerStat | null;
  WR1: PlayerStat | null;
  WR2: PlayerStat | null;
  TE: PlayerStat | null;
  FLX: PlayerStat | null;
  K: PlayerStat | null;
  DEF: PlayerStat | null;
  BN1: PlayerStat | null;
  BN2: PlayerStat | null;
  BN3: PlayerStat | null;
  BN4: PlayerStat | null;
  BN5: PlayerStat | null;
  BN6: PlayerStat | null;
  IR1: PlayerStat | null;
  IR2: PlayerStat | null;
};

type Matchup = {
  team1_username: string;
  team2_username: string;
  team1score: number;
  team2score: number
};

type MatchupParm = {
  players: PlayerFull[];
  members: User[];
  leagueID: number;
  team: Team;
  onReady: () => void;
};

const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");
const positionSlots = [
  "QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLX", "K", "DEF",
  "BN1", "BN2", "BN3", "BN4", "BN5", "BN6",
  "IR1", "IR2"
] as const;
const positionSlots1 = [
  "QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLX", "K", "DEF"
] as const;
const abPositions = ["BN1", "BN2", "BN3", "BN4", "BN5", "BN6", "IR1", "IR2"];

export default function MatchupDisplay({ players, team, members, leagueID, onReady }: MatchupParm) {
  const [matchupList, setMatchupList] = useState<Array<Matchup>>([]);
  const [teamList, setTeamList] = useState<Array<FantasyTeam>>([]);
  const [weekStarted, setWeekStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const matchupCreation = async () => {
      const memberIDs = members.map(member => member.id);
      const matchups = await fetchMatchups(memberIDs);

      const index = matchups.findIndex(
        (matchup: Matchup) =>
          matchup.team1_username === team.author.username ||
          matchup.team2_username === team.author.username
      );
      if (index > 0) {
        const temp = matchups[0];
        matchups[0] = matchups[index];
        matchups[index] = temp;
      }

      setMatchupList(matchups);
    };
    matchupCreation();
  }, []);

  useEffect(() => {
    const getTeams = async () => {
      if (!team || players.length === 0 || members.length === 0) return;
      const memberIDs = members.map(member => member.id);
      const allTeams = await fetchAllTeams(memberIDs, leagueID);
      setTeamList(allTeams);
      await addOwn(allTeams, players, team);
      onReady();
    };
    getTeams();
  }, [players, team]);

  const fetchMatchups = async (members: Array<number>) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    try {
      console.log("Fetching Matchups for members:", members);
      const response = await axios.get(`${API_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { members: members.join(",") }
      });
      console.log("Fetched Matchups:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching Matchups:", err);
      return;
    }
  };

  const addOwn = async (allTeams: FantasyTeam[], players: PlayerFull[], team: Team) => {
    if (team && players.length === positionSlots.length) {
      const formattedSelfTeam: any = {
        id: team.id,
        title: team.title,
        rank: team.rank,
        author: team.author.username
      };

      positionSlots.forEach((slot, i) => {
        const player = players[i];
        if (player.id == null) {
          formattedSelfTeam[slot] = null;
        } else {
          formattedSelfTeam[slot] = {
            id: player.id.toString(),
            fullName: player.firstName + " " + player.lastName,
            proj_fantasy: player.proj_fantasy,
            total_fantasy_points: player.total_fantasy_points
          };
        }
      });

      const finalTeamList = [...allTeams, formattedSelfTeam];
      setTeamList(finalTeamList);
    }
  };

  const fetchAllTeams = async (members: Array<number>, leagueID: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    try {
      const response = await axios.get(`${API_URL}/allTeams`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          members: members.join(","),
          leagueID: leagueID,
          matchup: true,
        }
      });
      console.log("Fetched Teams for matchup:", response.data);
      return response.data;
    }
    catch (err) {
      console.error("Error fetching Teams:", err);
      return;
    }
  };


  const normalizePosition = (slot: string) => {
    if (slot.startsWith("WR")) return "WR";
    if (slot.startsWith("RB")) return "RB";
    return slot;
  };
  //============================================================================== help with displaying
  const getTeamByUsername = (username: string): FantasyTeam | undefined => {
    return teamList.find(t => t.author === username);
  };

  const calculateTeamScore = (team: FantasyTeam): number => {
    return positionSlots1.reduce((sum, slot) => {
      const player = team[slot] as PlayerStat | null;
      const points = parseFloat(player?.total_fantasy_points as any) || 0;
      return Number((sum + points).toFixed(2));
    }, 0);
  };

  const formatPoints = (player: any): string => {
    const points = player?.total_fantasy_points;
    const proj = player?.proj_fantasy;

    if (weekStarted) return points;

    if (points > 0) {
      setWeekStarted(true);
      return points;
    }
    if (proj > 0) return proj;
    return "-";
  };

  //============================================================================== help with displaying
  const nextMatchup = () => {
    setCurrentIndex((prev) => (prev + 1) % matchupList.length);
  };

  const prevMatchup = () => {
    setCurrentIndex((prev) => (prev - 1 + matchupList.length) % matchupList.length);
  };


  return (
    <div className="matchup-display-container">
      {matchupList.length > 0 && (() => {
        const matchup = matchupList[currentIndex];
        const team1 = getTeamByUsername(matchup.team1_username);
        const team2 = getTeamByUsername(matchup.team2_username);

        const team1score = team1 ? calculateTeamScore(team1) : 0;
        const team2score = team2 ? calculateTeamScore(team2) : 0;

        return (
          <div key={currentIndex} className="matchup-card">
            <div className="matchup-header">
              <h5 className="team-labelL">{matchup.team1_username} </h5>
              <h3 className="team-labelL">{team1?.title}</h3>
              <h3>VS</h3>
              <h3 className="team-labelR">{team2?.title}</h3>
              <h5 className="team-labelR">{matchup.team2_username} </h5>
            </div>
            <div className="matchup-header">
              <h3 className="team-labelL">{team1score}</h3>
              <h3 className="team-labelR">{team2score}</h3>
            </div>
            <div className="matchup-positions">
              {positionSlots
                .filter((slot) => !abPositions.includes(slot))
                .map((slot) => (
                  <div key={slot} className="position-row">
                    <div className="team-side left-side">
                      <div className="player-name left">{team1?.[slot]?.fullName || "-"}</div>
                      <div className="player-points left">{formatPoints(team1?.[slot])}</div>
                    </div>

                    <div
                      className="position-slot"
                      style={{
                        color: slot === 'QB' ? '#b50d0d' :
                          slot === 'RB1' ? '#00a4e1' :
                            slot === 'RB2' ? '#00a4e1' :
                              slot === 'WR1' ? '#36df77' :
                                slot === 'WR2' ? '#36df77' :
                                  slot === 'TE' ? '#f0f757' :
                                    slot === 'FLX' ? '#ed3f54' :
                                      slot === 'K' ? '#772d8b' :
                                        slot === 'DEF' ? 'white' :
                                          'white'
                      }}
                    >
                      {normalizePosition(slot)}
                    </div>

                    <div className="team-side right-side">
                      <div className="player-points right">{formatPoints(team2?.[slot])}</div>
                      <div className="player-name right">{team2?.[slot]?.fullName || "-"}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="matchup-navigation">
              <button onClick={prevMatchup}>◀ Prev</button>
              <span>{currentIndex + 1} / {matchupList.length}</span>
              <button onClick={nextMatchup}>Next ▶</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
