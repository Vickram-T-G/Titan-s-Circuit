// LOCAL IMPORTS
//    fundemental imports
import config from "./config.js";
import gameState from "./gameState.js";
import { domElements } from "./domElements.js";

//others
import { onNodeClick } from "./gameLogic.js";

// creats 1 single hex
function createHex(Ox, Oy, radius, circuitLevel) {
  for (let i = 0; i < config.vertexNo; i++) {
    // const theta =
    //   (Math.PI / 3) * i +
    //   Math.PI / Math.round(Math.random() * config.randomTilt + 1);

    const theta = (Math.PI / 3) * i + Math.PI / config.randomTilt;
    const x = Ox + radius * Math.cos(theta);
    const y = Oy + radius * Math.sin(theta);
    const node = {
      id: gameState.nodes.length,
      x,
      y,
      circuitLevel,
      occupied: null,
      neighbors: [],
    };
    const nodeElement = document.createElement("div");

    nodeElement.className = "node";

    nodeElement.dataset.id = node.id; //connecting node created and the obj ie DOM to OBJ

    //dynamic positioning/styling
    nodeElement.style.left = `${x}px`;
    nodeElement.style.top = `${y}px`;

    nodeElement.addEventListener("click", () => onNodeClick(node));

    domElements.gameBoard.appendChild(nodeElement);

    gameState.nodes.push(node);
  }
}

// creates nodes of the hex
function createHexBoard() {
  console.log(domElements.gameBoard, domElements.gameBoard);

  //infering the center of the board from where we spawn our hexS
  const boardWidth = domElements.gameBoard.clientWidth;
  const boardHeight = domElements.gameBoard.clientHeight;

  const Ox = boardWidth / 2;
  const Oy = boardHeight / 2;

  createHex(Ox, Oy, Math.min(boardWidth, boardHeight) * 0.15, 0);
  createHex(Ox, Oy, Math.min(boardWidth, boardHeight) * 0.3, 1);
  createHex(Ox, Oy, Math.min(boardWidth, boardHeight) * 0.45, 2);
}

// function that connects nodes created previously
function makeEdge(node1, node2, weight) {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const theta = Math.atan2(dy, dx);

  const edge = {
    id: gameState.edges.length,
    node1: node1.id,
    node2: node2.id,
    weight,
    controlled: null,
  };

  //edge line
  const edgeElement = document.createElement("div");
  edgeElement.className = "edge";
  edgeElement.dataset.id = edge.id; //connecting edge and the obj
  edgeElement.style.left = `${node1.x}px`;
  edgeElement.style.top = `${node1.y}px`;
  edgeElement.style.width = `${length}px`;
  edgeElement.style.transform = `rotate(${theta}rad)`;

  //weight of edges
  const weightElement = document.createElement("div");
  weightElement.className = "edge-weight";
  weightElement.textContent = weight;
  weightElement.style.left = `${node1.x + dx / 2}px`;
  weightElement.style.top = `${node1.y + dy / 2}px`;

  domElements.gameBoard.appendChild(edgeElement);
  domElements.gameBoard.appendChild(weightElement);

  gameState.edges.push(edge);

  node1.neighbors.push(node2.id);
  node2.neighbors.push(node1.id);
}

// connecting nodes in hex
function connectHexNodes(circuitLevel, weights) {
  const circuitNodes = gameState.nodes.filter(
    (node) => node.circuitLevel === circuitLevel
  );

  for (let i = 0; i < config.vertexNo; i++) {
    const node1 = circuitNodes[i];
    const node2 = circuitNodes[(i + 1) % config.vertexNo];
    const weight = weights[i];

    makeEdge(node1, node2, weight);
  }
}

// connecting between hex
function connectHexRadially(innerCircuit, outerCircuit, weights) {
  const innerNodes = gameState.nodes.filter(
    (node) => node.circuitLevel === innerCircuit
  );
  const outerNodes = gameState.nodes.filter(
    (node) => node.circuitLevel === outerCircuit
  );

  for (let i = 0; i < config.vertexNo; i++) {
    if (weights[i] !== null) {
      makeEdge(innerNodes[i], outerNodes[i], weights[i]);
    }
  }
}

//using the connecting funcs
function makeEdges() {
  //connecting hex
  //COULD MAKE THIS RANDOM making game MORE FUN

  for (let i = 0; i < config.Edges.HexEdge.length; i++) {
    // console.log(...config.Edges.HexEdge[i]);
    connectHexNodes(...config.Edges.HexEdge[i]);
  }

  //connecting hex radially
  for (let i = 0; i < config.Edges.RadEdge.length; i++) {
    connectHexRadially(...config.Edges.RadEdge[i]);
  }
}

export { createHexBoard, makeEdges };
