import React, { useState, useEffect } from "react";

interface IHistory {
  moves: string[];
  onClick: (move: number) => void;
  selected: number;
}

interface IRow {
  index: number;
  white: string;
  black: string;
  onClickWhite: () => void;
  onClickBlack: () => void;
  selected: number;
}

const Row: React.FC<IRow> = ({
  index,
  white,
  black,
  onClickWhite,
  onClickBlack,
  selected,
}) => {
  useEffect(() => {
    document
      .getElementsByClassName("active")[0]
      .scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  return (
    <div className="row">
      <div className="row-index"> {index}</div>
      <div
        className={`row-white${selected === (index - 1) * 2 ? " active" : ""}`}
        onClick={onClickWhite}
      >
        {white}
      </div>
      <div
        className={`row-black${
          selected === (index - 1) * 2 + 1 ? " active" : ""
        }`}
        onClick={onClickBlack}
      >
        {black}
      </div>
    </div>
  );
};

const Moves: React.FC<IHistory> = ({ moves, onClick, selected }) => {
  const [rows, setRows] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const tRows = [];
    for (let i = 0; i < moves.length; i += 2) {
      tRows.push(
        <Row
          index={i / 2 + 1}
          white={moves[i]}
          black={i < moves.length ? moves[i + 1] : ""}
          onClickWhite={() => onClick(i)}
          onClickBlack={i + 1 < moves.length ? () => onClick(i + 1) : () => {}}
          selected={selected}
        />
      );
    }
    setRows(tRows);
  }, [moves, selected]);

  return <div className="moves">{rows}</div>;
};

export default Moves;
