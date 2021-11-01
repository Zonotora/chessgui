import React from "react";

interface IHeader {
  loadPGN: () => void;
  loadPGN2: () => void;
}

const Header: React.FC<IHeader> = (options) => {
  return (
    <div className="header">
      <div className="submit" onClick={options.loadPGN}>
        load 1
      </div>
      <div className="submit" onClick={options.loadPGN2}>
        load 2
      </div>
    </div>
  );
};

export default Header;
