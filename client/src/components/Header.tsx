import React from "react";

interface IHeader {
  loadPGN: () => void;
}

const Header: React.FC<IHeader> = (options) => {
  return (
    <div className="header">
      <div className="submit" onClick={options.loadPGN}>
        load
      </div>
    </div>
  );
};

export default Header;
