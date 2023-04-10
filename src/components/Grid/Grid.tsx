import React, { useContext } from "react";

import "./grid.css";
import { BoardContext } from "../Board/BoardContext";

export const Grid = () => {
  const { tileCount } = useContext(BoardContext);

  const renderGrid = () => {
    const length = tileCount * tileCount;
    return Array.from(Array(length).keys()).map((i) => (
      <div key={`${i}`} className="grid-cell" />
    ));
  };

  return <div className="grid">{renderGrid()}</div>;
};
