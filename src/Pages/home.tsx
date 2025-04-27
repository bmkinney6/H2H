
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
    </div>
  );
}


import '../Styles/HomePre.css';
import {useState} from "react";

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
