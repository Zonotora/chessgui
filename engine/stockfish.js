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
    this.buffer = "";
    this.info = [];
    this.status = false;
  }

  next() {
    return this.fens.shift();
  }

  parse(s) {
    const lines = s.split("\n");
    let hasBestmove = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("bestmove")) {
        hasBestmove = true;
        const bestmove = s.split(" ")[1];
        const last = i === 0 ? this.buffer : lines[i - 1];

        console.log(last);
        const info = parseInfo(last);

        this.info.push({
          bestmove,
          info,
        });

        this.status = this.info.length === this.count;
        this.buffer = "";
        console.log(this.info.length, this.count);
      }
    }
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i] !== "") {
        this.buffer = lines[i];
        break;
      }
    }
    return hasBestmove;
  }
}

module.exports = Stockfish;
