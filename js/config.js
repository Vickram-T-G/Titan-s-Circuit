// vertexNo should decided by user

// import { makeEdges } from "./boardSetup";

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const config = {
  totalGameTime: 10 * 60,
  playerTimer: 30,

  nodeSize: 30,
  PawnSize: 24,
  maxPawnsPerPlayer: 4,

  vertexNo: 6,

  // DUNEs
  // reality warp
  randomTilt: randomInt(1, 6),
  realityWarpTime: 0.1,
  enableRealityWarp: false,
  realityWarpInterval: 8000,
  tilt: {
    rotation: 0,
    skewX: 0,
    skewY: 0,
    scale: 1,
  },

  // gaia wraith
  enableGaiasWrath: false,
  minEdgeWeight: 1,
  maxEdgeWeight: 9,
  gaiaWrathTurns: 3,

  Edges: {
    // hex connections
    HexEdge: [
      [0, [8, 9, 8, 9, 8, 9]],
      [1, [6, 4, 5, 6, 4, 5]],
      [2, [1, 1, 1, 1, 1, 1]],
      // [3, [1, 1, 1, 1, 1, 1]],
    ],

    // radial connections
    RadEdge: [
      [0, 1, [5, null, 8, null, 7, null]],
      [1, 2, [null, 5, null, 5, null, 4]],
    ],
  },
};

export default config;
