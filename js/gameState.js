//    fundemental local imports
import config from "./config.js";

const gameState = {
  currentPlayer: "red",

  //board stufs
  selectedNode: null,

  unlockedHex: [2],
  nodes: [],
  edges: [],
  highlightedNodes: [],

  moveHistory: [],
  currentMoveIndex: -1,

  //players stuffs
  redScore: 0,
  blueScore: 0,
  redPawnsPlaced: 0,
  bluePawnsPlaced: 0,
  redMoveHistory: [],
  blueMoveHistory: [],

  isPaused: false,
  gameTimer: config.totalGameTime,
  playerTimer: config.playerTimer,
  gameTimerInterval: null,
  playerTimerInterval: null,

  // dunes
  //reality warpp
  realityWarpInterval: null,

  // gaia's wrath
  gaiaWrathActive: false,
  gaiaWrathUsed: false,
  gaiaWrathTurnsLeft: 0,
  originalEdgeWeights: null,
};

export default gameState;
