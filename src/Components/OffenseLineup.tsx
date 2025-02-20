import PlayerCircleIcon from "./PlayerCircleIcon.tsx";
import "../Styles/Index.css";

export default function OffenseLineup() {
  return (
    <div className="container-fluid OffenseLineup">
      <div className="d-flex justify-content-evenly">
        <PlayerCircleIcon />
        <PlayerCircleIcon />
        <PlayerCircleIcon />
        <PlayerCircleIcon />
      </div>
      <div className=" QB">
        <PlayerCircleIcon />
      </div>
      <div className=" RB d-flex justify-content-evenly">
        <PlayerCircleIcon />
        <PlayerCircleIcon />
      </div>
    </div>
  );
}
