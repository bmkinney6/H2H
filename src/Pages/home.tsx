import Carousel from "../Components/Carousel.tsx";
import TeamCard from "../Components/TeamCard.tsx";
import "../Styles/Index.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

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
              src="/images/my_leagues.png"
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
              src="/images/search_leagues.png"
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
              src="/images/player_search.png"
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

function HomePre() {
  return (
    <div className="container">
      <h1 className="text-center">Home Page Before Login</h1>
      <Carousel />
    </div>
  );
}

export { Home, HomePre };
