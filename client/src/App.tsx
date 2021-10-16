import React, { useEffect, useState } from "react";
import "./App.css";
import Chessboard from "chessboardjsx";
import {
  BsFillSkipEndFill,
  BsFillSkipForwardFill,
  BsFillSkipStartFill,
  BsFillSkipBackwardFill,
} from "react-icons/bs";

import History from "./components/History";
import Chess from "./chess";

// pass in a FEN string to load a particular position

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
  const [chess, setChess] = useState(new Chess());
  const [fen, setFen] = useState<string>(new Chess().fen());

  useEffect(() => {
    const fen = chess.now();
    setFen(fen);
  }, [chess]);

  // useEffect(() => {
  //   const fen = chess.fen();

  //   post("/api", {
  //     fen,
  //   }).then((response) => {
  //     console.log(response);
  //     setFen(fen);
  //   });
  // }, [chess]);

  return (
    <div>
      <div className="chess">
        <div className="evalbar"></div>
        <div className="board">
          <Chessboard position={fen} />
        </div>

        <div className="splitter"></div>

        <div className="panel">
          <div className="moves">
            {/* <input type="text" /> */}
            <div
              className="submit"
              onClick={() => {
                setChess(new Chess("", pgn.join("\n")));
              }}
            >
              load
            </div>
          </div>
          <div className="moves">
            <History
              moves={chess.history()}
              onClick={(move) => {
                const fen = chess.moveTo(move);
                setFen(fen);
              }}
            />
          </div>

          <div className="play-panel">
            <div
              className="first"
              onClick={() => {
                const fen = chess.first();
                setFen(fen);
              }}
            >
              <BsFillSkipBackwardFill size={40} />
            </div>
            <div
              className="previous"
              onClick={() => {
                const fen = chess.previous();
                setFen(fen);
              }}
            >
              <BsFillSkipStartFill size={40} />
            </div>
            <div
              className="next"
              onClick={() => {
                const fen = chess.next();
                setFen(fen);
              }}
            >
              <BsFillSkipEndFill size={40} />
            </div>
            <div
              className="last"
              onClick={() => {
                const fen = chess.last();
                setFen(fen);
              }}
            >
              <BsFillSkipForwardFill size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
