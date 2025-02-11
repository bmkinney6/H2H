import interact from "interactjs";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize interact.js for draggable player cards
  interact(".player-card").draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    autoScroll: true,
    listeners: {
      move: dragMoveListener,
    },
  });

  // Initialize interact.js for droppable lineup positions
  interact(".lineup-position").dropzone({
    accept: ".player-card",
    overlap: 0.75,
    ondrop: function (event) {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      // Append the draggable element to the dropzone
      dropzoneElement.appendChild(draggableElement);
    },
  });

  // Example player data
  const players = [
    { name: "Player 1", position: "QB", image: "player1.jpg" },
    { name: "Player 2", position: "RB", image: "player2.jpg" },
    { name: "Player 3", position: "WR", image: "player3.jpg" },
    // Add more players as needed
  ];

  // Append player cards to the search results
  const searchResults = document.getElementById("search-results");
  if (searchResults) {
    players.forEach((player) => {
      const card = createPlayerCard(player);
      searchResults.appendChild(card);
    });
  }
});

function dragMoveListener(event: Interact.DragEvent) {
  const target = event.target;
  const xAttr = target.getAttribute("data-x");
  const yAttr = target.getAttribute("data-y");
  const x = (xAttr ? parseFloat(xAttr) : 0) + event.dx;
  const y = (yAttr ? parseFloat(yAttr) : 0) + event.dy;

  target.style.transform = `translate(${x}px, ${y}px)`;

  target.setAttribute("data-x", x.toString());
  target.setAttribute("data-y", y.toString());
}

function createPlayerCard(player: {
  name: string;
  position: string;
  image: string;
}): HTMLElement {
  const card = document.createElement("div");
  card.className = "player-card";
  card.draggable = true;

  const playerInfo = document.createElement("div");
  playerInfo.className = "player-info";

  const img = document.createElement("img");
  img.src = player.image;
  img.alt = player.name;
  img.className = "player-headshot";

  const infoDiv = document.createElement("div");

  const name = document.createElement("h5");
  name.innerText = player.name;

  const position = document.createElement("p");
  position.innerText = `Position: ${player.position}`;

  infoDiv.appendChild(name);
  infoDiv.appendChild(position);
  playerInfo.appendChild(img);
  playerInfo.appendChild(infoDiv);
  card.appendChild(playerInfo);

  return card;
}
