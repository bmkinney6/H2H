import OffenseLineup from "../Components/OffenseLineup.tsx";
import DefenseLineup from "../Components/DefenseLinup.tsx";
import BenchPlayers from "../Components/Bench.tsx";
import TopTenPlayers from "../Components/topTenPlayers.tsx";

export default function Draft() {
  return (
    <div>
      <h1 className="text-center">Draft Center</h1>
      <div className="draft-section">
        <div className="team-view  d-block">
          <BenchPlayers />
          <DefenseLineup />
          <OffenseLineup />
        </div>
        <div className="draft-search">
          <h2 className="mx-auto text-center">Scouting Center</h2>
        </div>
        <div className="top-players overflow-y-auto">
          <TopTenPlayers />
        </div>
      </div>
    </div>
  );
}
