import React, { useState, useEffect } from "react";

interface IHistory {
  moves: string[];
  onClick: (move: number) => void;
}

interface IRow {
  index: number;
  white: string;
  black: string;
  onClickWhite: () => void;
  onClickBlack: () => void;
}

const Row: React.FC<IRow> = ({
  index,
  white,
  black,
  onClickWhite,
  onClickBlack,
}) => {
  return (
    <div className="row">
      <div className="row-index"> {index}</div>
      <div className="row-white" onClick={onClickWhite}>
        {white}
      </div>
      <div className="row-black" onClick={onClickBlack}>
        {black}
      </div>
    </div>
  );
};

const History: React.FC<IHistory> = ({ moves, onClick }) => {
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
          onClickBlack={i < moves.length ? () => onClick(i + 1) : () => {}}
        />
      );
    }
    setRows(tRows);
  }, [moves]);

  return <>{rows}</>;
};

export default History;
