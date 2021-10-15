const express = require("express");
const { spawn } = require("child_process");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();
const engine = spawn(process.env.ENGINE);

app.use(express.json());

const sendUCI = (msg) => {
  engine.stdin.write(`${msg}\n`);
};

engine.stdout.on("data", (chunk) => {
  console.log(chunk.toString("ascii"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post("/api", function (req, res) {
  console.log(req.body);
  // console.log(engine);
  // sendUCI(`position fen ${req.body.fen}`);
  sendUCI("eval");

  // engine.send(`position fen ${req.body.fen}`);

  res.json({ message: "stockfish" });
});
