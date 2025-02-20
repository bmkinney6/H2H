import React, { useEffect } from "react";
import interact from "interactjs";
import OffenseLineup from "../Components/OffenseLineup.tsx";
import DefenseLineup from "../Components/DefenseLinup.tsx";
import BenchPlayers from "../Components/Bench.tsx";

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
    <div>
      <h1 className="text-center">Draft Center</h1>
      <div className="draft-section">
        <div className="team-view d-block">
          <BenchPlayers />
          <DefenseLineup />
          <OffenseLineup />
        </div>
        <div className="draft-search">
          <h2 className="mx-auto text-center">Scouting Center</h2>
        </div>
        <div className="top-players">
          <h2 className="mx-auto text-center">Top Players</h2>
        </div>
      </div>
    </div>
  );
};

export default Draft;
