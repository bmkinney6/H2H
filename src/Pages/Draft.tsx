import React, { useEffect } from "react";
import interact from "interactjs";
import PlayerCard from "../Components/PlayerCard.tsx";

const Draft: React.FC = () => {
  useEffect(() => {
    // Initialize interact.js for draggable player cards
    interact(".player-card").draggable({
      inertia: false, // Disable inertia for smoother dragging
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "body", // Allow dragging within the entire body
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
        end(event) {
          const target = event.target as HTMLElement;
          if (!event.dropzone) {
            // Reset the position if it was not dropped in a valid drop zone
            target.style.transition = "transform 0.3s ease"; // Add smooth transition
            target.style.transform = "translate(0, 0)";
            target.setAttribute("data-x", "0");
            target.setAttribute("data-y", "0");

            // Remove transition after the animation is complete
            setTimeout(() => {
              target.style.transition = "";
            }, 300); // Match the duration of the CSS transition
          }
        },
      },
    });

    // Initialize interact.js for droppable lineup positions
    interact(".lineup-position").dropzone({
      accept: ".player-card",
      overlap: 0.75,
      ondrop: function (event) {
        const draggableElement = event.relatedTarget as HTMLElement;
        const dropzoneElement = event.target as HTMLElement;

        // Append the draggable element to the dropzone
        dropzoneElement.appendChild(draggableElement);

        // Reset the transform and data attributes
        draggableElement.style.transform = "translate(0, 0)";
        draggableElement.setAttribute("data-x", "0");
        draggableElement.setAttribute("data-y", "0");
      },
    });
  }, []);

  const dragMoveListener = (event: Interact.InteractEvent) => {
    const target = event.target as HTMLElement;
    const x =
      (parseFloat(target.getAttribute("data-x") || "0") || 0) + event.dx;
    const y =
      (parseFloat(target.getAttribute("data-y") || "0") || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute("data-x", x.toString());
    target.setAttribute("data-y", y.toString());
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Lineup Section */}
        <div className="col-md-4">
          <div id="lineup" className="lineup">
            <h4>Lineup</h4>
            <div className="lineup-position" data-position="QB">
              QB
            </div>
            <div className="lineup-position" data-position="RB1">
              RB1
            </div>
            <div className="lineup-position" data-position="RB2">
              RB2
            </div>
            <div className="lineup-position" data-position="WR1">
              WR1
            </div>
            <div className="lineup-position" data-position="WR2">
              WR2
            </div>
            <div className="lineup-position" data-position="TE">
              TE
            </div>
            <div className="lineup-position" data-position="FLEX">
              FLEX
            </div>
            <div className="lineup-position" data-position="DST">
              DST
            </div>
            <div className="lineup-position" data-position="K">
              K
            </div>
          </div>
        </div>
        {/* Scouting and Search Section */}
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-4">
              {/* Search Section */}
              <div id="search-section" className="search-section">
                <h4>Search Players</h4>
                <input
                  type="text"
                  id="search-input"
                  className="form-control mb-2"
                  placeholder="Search for players..."
                />
                <button className="btn btn-primary btn-block">
                  Filter by Position
                </button>
                <button className="btn btn-primary btn-block">
                  Filter by Team
                </button>
                <div
                  id="search-results"
                  className="search-results mt-2"
                  onLoad={PlayerCard}
                >
                  {/* Player Cards will be appended here */}
                </div>
              </div>
            </div>
            <div className="col-md-8">
              {/* Player List Section */}
              <div id="player-list" className="player-list">
                <h4>Player List</h4>
                <div className="player-card" draggable="true">
                  <div className="player-info">
                    <img
                      src="player1.jpg"
                      alt="Player 1"
                      className="player-headshot"
                    />
                    <div>
                      <h5>Player 1</h5>
                      <p>Position: QB</p>
                    </div>
                  </div>
                </div>
                {/* More player cards... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Draft;
