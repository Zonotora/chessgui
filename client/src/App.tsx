import React, { useEffect, useState } from "react";
import "./App.css";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

// pass in a FEN string to load a particular position
const chess = new Chess(
  "r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19"
);
const pgn = [
  '[Event "Casual Game"]',
  '[Site "Berlin GER"]',
  '[Date "1852.??.??"]',
  '[EventDate "?"]',
  '[Round "?"]',
  '[Result "1-0"]',
  '[White "Adolf Anderssen"]',
  '[Black "Jean Dufresne"]',
  '[ECO "C52"]',
  '[WhiteElo "?"]',
  '[BlackElo "?"]',
  '[PlyCount "47"]',
  "",
  "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O",
  "d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4",
  "Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6",
  "Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8",
  "23.Bd7+ Kf8 24.Bxe7# 1-0",
];
chess.load_pgn(pgn.join("\n"));

const post = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
};

const App: React.FC = () => {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  useEffect(() => {
    const fen = chess.fen();

    post("/api", {
      fen,
    }).then((response) => {
      console.log(response);
      setFen(fen);
    });
  }, []);

  return (
    <div>
      <div className="chess">
        <div className="evalbar"></div>
        <div className="board">
          <Chessboard position={fen} />
        </div>

        <div className="splitter"></div>
        <div className="panel">
          <div className="moves"></div>
          <div className="moves"></div>
          <input
            type="text"
            name="name"
            onChange={(e) => setFen(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
