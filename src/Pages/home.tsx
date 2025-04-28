import { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

import LeagueDisplay from "../Components/LeagueDisplay.tsx";
import { League } from '../Pages/LeagueUserDetails';

import "../Styles/Index.css";
import "../Styles/homeMatchups.css";
import '../Styles/HomePre.css';


import { useNavigate } from "react-router-dom";

type Matchup = {
  id: number;
  league_name: string;
  team1_username: string;
  team2_username: string;
  team1score: string;
  team2score: string;
}
type News = {
  id: number;
  headline: string;
  text: string;
  date: string;
  player: Player;

}
type Player = {
  firstName: string;
  lastName: string;
  position: string;
  team: string;
}

const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");
const API_URL_NEWS = import.meta.env.VITE_PLAYER_NEWS_URL;

function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [leagues, setLeagues] = useState<League[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [matchups, setMatchups] = useState<Matchup[]>([]);

  const [news, setNews] = useState<News[]>([]);
  const [currentNews, setCurrentNews] = useState<News | null>(null);


  useEffect(() => {
    const homeStuff = async () => {
      fetchLeagues();
      fetchMatchups();
      fetchNews();
    };
    homeStuff();
  }, []);

  useEffect(() => {
    if (leagues.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % leagues.length);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [leagues.length]);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * news.length);
      setCurrentNews(news[randomIndex]);
      console.log("Current News:", news[randomIndex]);
    }, 20000); // every 20 seconds

    return () => clearInterval(interval);
  }, [news]);


  const fetchMatchups = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/allMatchups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const matchups = response.data;
      console.log("Fetched Matchups:", matchups);
      setMatchups(matchups);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leagues.");
      console.error("Error fetching leagues:", err);
    }

  };

  const fetchNews = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }
    const id = 99;
    try {
      const response = await axios.get(`${API_URL_NEWS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const news = response.data.Player_news;
      setNews(news);
      console.log("Fetched News:", news);
      setCurrentNews(news[Math.floor(Math.random() * news.length)]);

      setError(null);
    } catch (err) {
      setError("Failed to fetch leagues.");
      console.error("Error fetching leagues:", err);
    }

  };

  const fetchLeagues = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/myleagues`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uniqueLeagues = removeDuplicateLeagues(response.data);
      setLeagues(uniqueLeagues);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leagues.");
      console.error("Error fetching leagues:", err);
    }
  };

  const removeDuplicateLeagues = (leagues: League[]) => {
    const uniqueLeaguesMap = new Map<number, League>();
    leagues.forEach((league) => {
      if (!uniqueLeaguesMap.has(league.id)) {
        uniqueLeaguesMap.set(league.id, league);
      }
    });
    return Array.from(uniqueLeaguesMap.values());
  };
  console.log("Rendering matchups:", matchups);

  return (
    <div className="container">
      <div className="row mt-4">
        {/* My Leagues Section */}
        <div className="col-md-4">
          <div
            className="card home-card"
            onClick={() => navigate("/my-leagues")}
          >
            <img
              src="/public/league.png"
              alt="My Leagues"
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">My Leagues</h5>
              <p className="card-text">
                View and manage your fantasy football leagues.
              </p>
            </div>
          </div>
        </div>

        {/* Search Leagues Section */}
        <div className="col-md-4">
          <div
            className="card home-card"
            onClick={() => navigate("/search-leagues")}
          >
            <img
              src="/public/american-football-field.png"
              alt="Search Leagues"
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">Search Leagues</h5>
              <p className="card-text">
                Find and join new fantasy football leagues.
              </p>
            </div>
          </div>
        </div>

        {/* Player Search Section */}
        <div className="col-md-4">
          <div
            className="card home-card"
            onClick={() => navigate("/scout")}
          >
            <img
              src="/public/people.png"
              alt="Player Search"
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">Player Search</h5>
              <p className="card-text">
                Explore player statistics and projections.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          {matchups.length > 0 &&(
          <div className="matchup-ticker-wrapper">
            <div className="ticker-track">
              <div className="ticker-content">
                {[...matchups, ...matchups].map((matchup, index) => (
                  <div key={index} className="matchup-card">
                    <h3>{matchup.team1_username} vs {matchup.team2_username}</h3>
                    <p>{matchup.team1score} - {matchup.team2score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>)}
        </div>
        <div className = "league_news-container">
          <div className="league-section">
            {leagues.length > 0 && currentIndex < leagues.length && (
              <>
                <h2 className="text-center">{leagues[currentIndex].name}</h2>
                <LeagueDisplay League={leagues[currentIndex]} />
              </>
            )}

          </div>
          <div className="news-section">
            {currentNews && (
              <div className="news-container">
                <h2 className="text-center">Player News</h2>
                <div key={currentNews.id} className="news-card">
                  <h3>{currentNews.headline}</h3>
                  <p>{currentNews.text}</p>
                  <p>{`Date: ${new Date(currentNews.date).toLocaleDateString()}`}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function HomePre() {
  const [showAlert, setShowAlert] = useState(false); // Manage alert visibility

  const triggerShake = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;  // Cast to HTMLDivElement
    target.classList.add('shake');
    setTimeout(() => {
      target.classList.remove('shake');
    }, 1000);  // Shake lasts for 1 second

    setShowAlert(true); // Show alert
    setTimeout(() => {
      setShowAlert(false); // Hide alert after 3 seconds
    }, 3000);  // Alert duration
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    triggerShake(event);  // Shake the card and show the alert
  };

  return (
      <div className="container">
        {/* Bootstrap Alert */}
        {showAlert && (
            <div className="alert alert-warning alert-dismissible fade show mt-3" role="alert">
              You must be logged in to access this feature.
              <button type="button" className="btn-close m-auto" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}></button>
            </div>
        )}

        <div className="row mt-4">
          {/* My Leagues Section */}
          <div className="col-md-4">
            <div
                className="card home-card"
                onClick={handleCardClick}
            >
              <img
                  src="/public/league.png"
                  alt="My Leagues"
                  className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">My Leagues</h5>
                <p className="card-text">
                  View and manage your fantasy football leagues.
                </p>
              </div>
            </div>
          </div>

          {/* Search Leagues Section */}
          <div className="col-md-4">
            <div
                className="card home-card"
                onClick={handleCardClick}
            >
              <img
                  src="/public/american-football-field.png"
                  alt="Search Leagues"
                  className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">Search Leagues</h5>
                <p className="card-text">
                  Find and join new fantasy football leagues.
                </p>
              </div>
            </div>
          </div>

          {/* Player Search Section */}
          <div className="col-md-4">
            <div
                className="card home-card"
                onClick={handleCardClick}
            >
              <img
                  src="/public/people.png"
                  alt="Player Search"
                  className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">Player Search</h5>
                <p className="card-text">
                  Explore player statistics and projections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export { Home, HomePre };
