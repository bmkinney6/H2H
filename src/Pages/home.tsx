import Carousel from "../Components/Carousel.tsx";
import TeamCard from "../Components/TeamCard.tsx";

function Home() {
  return (
    <div className="container">
      <h1 className="text-center">Home Page After Login</h1>
      <Carousel />
      <TeamCard />
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
