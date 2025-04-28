import { useNavigate } from "react-router-dom";
import CreateLeagueForm from "../Components/CreateLeagueForm";
import "../Styles/CreateLeaguePage.css"; 

const CreateLeaguePage = () => {
  const navigate = useNavigate();

  const handleLeagueCreated = () => {
    navigate("/"); 
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