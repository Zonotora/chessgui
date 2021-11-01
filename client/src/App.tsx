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
import Evalbar from "./components/Evalbar";
import data from "./data.json";
import data2 from "./data2.json";

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

const pgn2 = [
  '[Event "Live Chess"]',
  '[Site "Chess.com"]',
  '[Date "2021.10.24"]',
  '[Round "?"]',
  '[White "Unknown 1"]',
  '[Black "Unknown 2"]',
  '[Result "1-0"]',
  '[ECO "B20"]',
  '[WhiteElo "1000"]',
  '[BlackElo "1000"]',
  '[TimeControl "60+1"]',
  '[EndTime "7:55:30 PDT"]',
  '[Termination "Unknown 1 won on time"]',
  "",
  "1. e4 c5 2. Bc4 d6 3. Nf3 Nf6 4. O-O Nc6 5. e5 Nxe5 6. Nxe5 dxe5 7. Re1 Qc7 8.",
  "d3 e6 9. Bg5 Be7 10. Bxf6 Bxf6 11. Qf3 O-O 12. Nc3 Bd7 13. Ne4 Bc6 14. Nxf6+",
  "gxf6 15. Qg4+ Kh8 16. Re3 Rg8 17. Qh5 Rg6 18. Rh3 Rg7 19. g3 Kg8 20. Re1 Rd8 21.",
  "Qh6 Qe7 22. Rh4 a6 23. a3 b5 24. Ba2 1-0",
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

    const tScores: number[] = [];
    const h = chess.history();
    const d = h && h[1] === "c5" ? data2 : data;
    for (let i = 0; i < d.info.length; i++) {
      const info = d.info[i].info;
      let score = 0;
      if (info.score.cp) {
        score = info.score.cp;
      } else if (info.score.mate) {
        score = Math.sign(parseInt(info.score.mate)) * 20;
      }
      score = i % 2 === 1 ? score : -score;
      tScores.push(score);
    }

    setScores(tScores);

    return;

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
            score = sign * 20;
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
          loadPGN2={() => {
            setChess(new Chess("", pgn2.join("\n")));
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

        <Evalbar evaluation={move < scores.length ? scores[move] : 0.0} />

        <div className="panel">
          <div className="moves">
            <History
              moves={chess.history()}
              onClick={(move) => setMove(move)}
              selected={move}
            />
          </div>

          <div className="play-panel">
            <div
              className="first"
              onClick={() => {
                const fen = chess.first();
                setFen(fen);
                setMove(chess.current);
              }}
            >
              <BsFillSkipBackwardFill size={40} />
            </div>
            <div
              className="previous"
              onClick={() => {
                const fen = chess.previous();
                setFen(fen);
                setMove(chess.current);
              }}
            >
              <BsFillSkipStartFill size={40} />
            </div>
            <div
              className="next"
              onClick={() => {
                const fen = chess.next();
                setFen(fen);
                setMove(chess.current);
              }}
            >
              <BsFillSkipEndFill size={40} />
            </div>
            <div
              className="last"
              onClick={() => {
                const fen = chess.last();
                setFen(fen);
                setMove(chess.current);
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
