import { useNavigate } from "react-router-dom";
import CreateLeagueForm from "../Components/CreateLeagueForm";
import "../Styles/CreateLeaguePage.css"; // Import the CSS file for styling

const CreateLeaguePage = () => {
  const navigate = useNavigate();

  const handleLeagueCreated = () => {
    // After successful league creation, navigate to the leagues page or a specific league page
    navigate("/"); // You can customize the route if needed
  };

  return (
    <div className="create-league-page">
      <div className="create-league-container">
        <h1 className="create-league-title">Create a New Fantasy Football League</h1>
        <CreateLeagueForm onLeagueCreated={handleLeagueCreated} />
      </div>
    </div>
  );
};

export default CreateLeaguePage;