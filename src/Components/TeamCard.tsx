import "../Styles/Index.css";
import teams from "../LocalData/teams";

const TeamCard: React.FC = () => {
  return (
    <div className="cardContainer">
      <div className="card__container">
        {teams.map((team, index) => (
          <article className="card__article" key={index}>
            <img
              src={team.imgSrc}
              alt={`${team.name} logo`}
              className="card__img"
            />
            <div className="card__data">
              <span className="card__description">{team.city}</span>
              <h2 className="card__title">{team.description}</h2>
              <a href="#" className="card__button">
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
