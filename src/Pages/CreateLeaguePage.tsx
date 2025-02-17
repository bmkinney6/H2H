import { useNavigate } from "react-router-dom";
import CreateLeagueForm from "../Components/CreateLeagueForm";

const CreateLeaguePage = () => {
  const navigate = useNavigate();

  const handleLeagueCreated = () => {
    // After successful league creation, navigate to the leagues page or a specific league page
    navigate("/");  // You can customize the route if needed
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Fantasy Football League</h1>
      <CreateLeagueForm onLeagueCreated={handleLeagueCreated} />
    </div>
  );
};

export default CreateLeaguePage;
