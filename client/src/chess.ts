import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

class ChessWrapper extends Chess {
  fens: string[];
  current: number;

  constructor(fen?: string, pgn?: string) {
    super(fen);
    this.fens = [];
    this.current = 0;

    if (pgn !== undefined) {
      this.load_with_pgn(pgn);
    }
  }

  load_with_pgn = (pgn: string): boolean => {
    const success = this.load_pgn(pgn);
    if (!success) return false;

    const tChess = new Chess();
    this.fens = [];
    for (const move of this.history()) {
      tChess.move(move);
      const fen = tChess.fen();
      this.fens.push(fen);
    }
    return true;
  };

  moveTo = (move: number): string => {
    this.current = move;
    return this.fens[this.current];
  };

  previous = (): string => {
    if (this.fens.length === 0) {
      return this.fen();
    }
    this.current = Math.max(0, this.current - 1);
    return this.fens[this.current];
  };

  next = (): string => {
    if (this.fens.length === 0) {
      return this.fen();
    }
    this.current = Math.min(this.fens.length - 1, this.current + 1);
    return this.fens[this.current];
  };

  now = (): string => {
    if (this.fens.length === 0) {
      return this.fen();
    }
    return this.fens[this.current];
  };

  first = (): string => {
    if (this.fens.length === 0) {
      return this.fen();
    }
    this.current = 0;
    return this.fens[this.current];
  };

  last = (): string => {
    if (this.fens.length === 0) {
      return this.fen();
    }
    this.current = this.fens.length - 1;
    return this.fens[this.current];
  };
}

export default ChessWrapper;
