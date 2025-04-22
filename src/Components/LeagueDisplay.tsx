"user client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { League, Team } from '../Pages/LeagueUserDetails'; 
import "../Styles/League.css";

type LeagueDisplayParm = {
    League: League;
}

const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");

export default function LeagueDisplay({League}: LeagueDisplayParm) {
  const [teams, setTeams] = useState<Array<Team>>([]); // Adjust the type as needed

  useEffect(() =>{
    const displayLeague = async () => {
      const memberIDs = League.users.map(member => member.id);
      const allTeams = await fetchAllTeams(memberIDs, League.id);
      const sortedTeams = allTeams.sort((a: Team, b: Team) => a.rank - b.rank);
      setTeams(sortedTeams);
    };
    displayLeague();
  },[]);

  useEffect(() => {
    if(teams.length > 0) {
      console.log("Teams fetched and sorted:", teams);
    }
  },[teams]);

  const fetchAllTeams = async(members: Array<number>, leagueID: number) => {
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
          matchup: false,
        }
        });
        console.log("Fetched Teams for League:", response.data);
        return response.data;
    } 
    catch (err) {
      console.error("Error fetching Teams:", err);
      return;
    } 
  };
    
  return (
  <div className="league-display">
    {/* Header row */}
    <div className="team-header-row">
      <div className="rank-column"></div>
      <div className="team-name-column"></div>
      <div className="stats-column">
        <span>PF</span>
        <span>PA</span>
      </div>
    </div>

    {/* Team rows */}
    {teams.map((team) => (
      <div key={team.id} className="team-row">
        <div className="rank-column">
          <strong>{team.rank}</strong>
        </div>

        <div className="team-name-column">
          <p className="team-title">{team.title}</p>
          <p className="record">{team.wins}-{team.losses}</p>
        </div>

        <div className="stats-column">
          <p>{team.points_for}</p>
          <p>{team.points_against}</p>
        </div>
      </div>
    ))}
  </div>
  );
  
}