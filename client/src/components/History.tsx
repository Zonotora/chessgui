import React from "react";

interface IHistory {
  moves: string[];
  onClick: (move: number) => void;
}

const History: React.FC<IHistory> = ({ moves, onClick }) => {
  return (
    <>
      {moves.map((move, i) => (
        <div className="move" onClick={() => onClick(i)}>
          {move}
        </div>
      ))}
    </>
  );
};

export default History;
