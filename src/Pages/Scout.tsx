import PlayerList from "../Components/PlayerList.tsx";
import PlayerSearchCard from "../Components/PlayerCard";

export default function Scout() {
  return (
    <div className="container-fluid">
      <PlayerSearchCard />
      <PlayerList />
    </div>
  );
}
