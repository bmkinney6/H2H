import "../Styles/Index.css";

export default function PlayerCard() {
  return (
    <div
      id="PlayerCard"
      className="container-sm d-flex flex-column justify-content-center align-items-center p-3"
    >
      <img
        src="src/assets/H2HLogo.jpg"
        id="PlayerCardImg"
        className="rounded-circle"
        width={100}
        height={100}
        alt="Player Headshot"
      />
      <h1 className="text-center">Name</h1>
      <h2 className="text-center">Team</h2>
      <h2 className="text-center">Position</h2>
      <h5 className="text-center">Hometown</h5>
    </div>
  );
}
