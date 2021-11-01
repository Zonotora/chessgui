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
import Chart from "./components/Chart";
import Header from "./components/Header";
import data from "./data.json";

// pass in a FEN string to load a particular position

// [Event "Casual Game"]
// [Site "Berlin GER"]
// [Date "1852.??.??"]
// [EventDate "?"]
// [Round "?"]
// [Result "1-0"]
// [White "Adolf Anderssen"]
// [Black "Jean Dufresne"]
// [ECO "C52"]
// [WhiteElo "?"]
// [BlackElo "?"]
// [PlyCount "47"]
// 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O
// d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4
// Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6
// Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8
// 23.Bd7+ Kf8 24.Bxe7# 1-0
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
  const [scores, setScores] = useState<number[]>([]);
  const [move, setMove] = useState<number>(0);

  useEffect(() => {
    const fen = chess.moveTo(move);
    if (fen) setFen(fen);
  }, [move, chess]);

  useEffect(() => {
    const fen = chess.now();
    setFen(fen);

    // const tScores: number[] = [];
    // for (let i = 0; i < data.info.length; i++) {
    //   const info = data.info[i].info;
    //   let score = 0;
    //   if (info.score.cp) {
    //     score = info.score.cp;
    //   } else if (info.score.mate) {
    //     score = Math.sign(parseInt(info.score.mate)) * 100;
    //   }
    //   score = i % 2 === 1 ? score : -score;
    //   tScores.push(score);
    // }

    // setScores(tScores);
    // console.log(chess.fens);

    const baseScores: number[] = [];
    for (let i = 0; i < chess.fens.length; i++) {
      baseScores.push(0);
    }
    setScores(baseScores);

    post("/api/new", {
      fens: chess.fens,
    }).then((response) => {
      console.log(response);
    });

    let received = 0;

    const interval = setInterval(() => {
      post("/api/status", {
        received,
      }).then((response) => {
        received = response.info.length;

        const tScores = [...baseScores];
        for (let i = 0; i < response.info.length; i++) {
          const info = response.info[i].info;
          let score = 0;
          if (info.score.cp) {
            score = info.score.cp;
          } else if (info.score.mate) {
            const mate = parseInt(info.score.mate);
            let sign = Math.sign(mate);
            if (mate === 0 && i > 0) {
              sign = Math.sign(tScores[i - 1]);
              sign = i % 2 === 1 ? sign : -sign;
            }
            score = sign * 100;
          }
          score = i % 2 === 1 ? score : -score;
          tScores[i] = score;
        }
        console.log(response);
        setScores(tScores);
        if (response.status) {
          clearInterval(interval);
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [chess]);

  return (
    <div>
      <div className="top">
        <Header
          loadPGN={() => {
            setChess(new Chess("", pgn.join("\n")));
          }}
        />
      </div>
      <div className="middle">
        <div className="board">
          <Chessboard
            position={fen}
            calcWidth={({ screenWidth, screenHeight }) =>
              Math.max(Math.min(300, screenHeight * 0.7), screenHeight * 0.65)
            }
          />
        </div>

        <div className="evalbar" />

        <div className="panel">
          <div className="moves">
            <History
              moves={chess.history()}
              onClick={(move) => setMove(move)}
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
      <div className="bottom">
        <Chart
          selected={move}
          scores={scores}
          onClick={(move: number) => setMove(move)}
        />
      </div>
    </div>
  );
};

export default App;
