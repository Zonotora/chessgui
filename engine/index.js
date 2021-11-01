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

const sendFen = (fen, depth = 18) => {
  sendUCI(`position fen ${fen}`);
  sendUCI(`go depth ${depth}`);
};

engineProcess.stdout.on("data", (chunk) => {
  const s = chunk.toString("ascii");
  if (engine.parse(s)) {
    const fen = engine.next();
    console.log(fen);
    sendFen(fen);
  }
});

sendUCI("isready");
sendUCI("setoption name threads value 4");

app.post("/api/new", function (req, res) {
  const fens = req.body.fens;
  const fen = fens.shift();
  engine.setFens(fens);
  sendFen(fen);

  res.json({ status: engine.status });
});

app.post("/api/status", function (req, res) {
  if (req.body.received === engine.info.length) {
    sendFen(engine.current);
  }

  res.json({ info: engine.info, status: engine.status });
});
