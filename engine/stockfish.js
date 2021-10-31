const parseInfo = (s) => {
  const ret = {};
  const info = s.split(" ");
  for (let i = 1; i < info.length; i++) {
    const v = info[i];
    switch (v) {
      case "score":
        const score = {};
        if (info[i + 1] == "cp") score["cp"] = parseInt(info[i + 2]) / 100.0;
        else if (info[i + 1] == "mate") score["mate"] = info[i + 2];
        i += 2;
        ret[v] = score;
        break;
      case "pv":
        const moves = [];
        i += 1;
        while (i < info.length) {
          moves.push(info[i++]);
        }
        ret[v] = moves;
      default:
        ret[v] = info[++i];
        break;
    }
  }
  return ret;
};

class Stockfish {
  constructor() {
    this.setFens([]);
  }

  setFens(fens) {
    this.fens = fens;
    this.count = fens.length + 1;
    this.buffer = [];
    this.queue = [];
    this.info = [];
    this.status = false;
  }

  next() {
    return this.fens.shift();
  }

  parse(s) {
    if (s.startsWith("bestmove")) {
      const bestmove = s.split(" ")[1];
      const info = parseInfo(this.buffer[this.buffer.length - 1]);

      this.info.push({
        bestmove,
        info,
      });

      this.status = this.info.length === this.count;
      this.buffer = [];
      console.log(this.fens.length);
      return true;
    }

    this.buffer.push(s);
    return false;
  }
}

module.exports = Stockfish;
