const express = require("express");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const Stockfish = require("./stockfish");

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const engineProcess = spawn(process.env.ENGINE);
const engine = new Stockfish();

const sendUCI = (msg) => {
  engineProcess.stdin.write(`${msg}\n`);
};

const initializeEngine = () => {
  sendUCI("isready");
  sendUCI("setoption name threads value 4");
};

initializeEngine();

const sendFen = (fen, depth = 18) => {
  sendUCI(`position fen ${fen}`);
  sendUCI(`go depth ${depth}`);
};

engineProcess.stdout.on("data", (chunk) => {
  const s = chunk.toString("ascii");
  if (engine.parse(s)) {
    const fen = engine.next();
    if (fen) sendFen(fen);
  }
});

app.post("/api/new", function (req, res) {
  const fens = req.body.fens;
  const fen = fens.shift();
  engine.setFens(fens);

  sendUCI("ucinewgame");
  // sendUCI(`bench 64 4 18 ${tmpobj.name} depth`);
  sendFen(fen);

  res.json({ status: engine.status });
});

app.post("/api/status", function (req, res) {
  res.json({ info: engine.info, status: engine.status });
});
