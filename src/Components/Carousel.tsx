import "../Styles/Index.css";

export default function Carousel() {
  return (
    <div
      id="HomePageCarousel"
      className="carousel slide w-50 mx-auto"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner rounded-5">
        <div className="carousel-item active">
          <img
            src="/DraftPic.png"
            className="carousel-img"
            alt="Draft Picture"
          />
        </div>
        <div className="carousel-item">
          <img src="/LeagueFormat.png" className="carousel-img" alt="Format" />
        </div>
        <div className="carousel-item">
          <img src="/StatPage.png" className="carousel-img" alt="Stat" />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#HomePageCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#HomePageCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
