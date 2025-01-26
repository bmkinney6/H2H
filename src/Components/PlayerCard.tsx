import "../Styles/Index.css";

export default function PlayerCard() {
  return (
    <div className="container-sm border border-dark rounded-5">
      <img
        src="src/assets/H2HLogo.jpg"
        id="PlayerCardImg"
        className="rounded-circle"
        width={100}
        height={100}
        alt="Logo"
      />
      <h1 className="text-center">Player Card</h1>
    </div>
  );
}
