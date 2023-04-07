import React, { useContext } from "react";

import "./grid.css";
import { BoardContext } from "../Board/BoardContext";

export const Grid = () => {
  const { tileCount } = useContext(BoardContext);

  const renderGrid = () => {
    const length = tileCount * tileCount;
    const cells: JSX.Element[] = [];

    for (let index = 0; index < length; index += 1) {
      cells.push(<div key={`${index}`} className={`grid-cell`} />);
    }

    return cells;
  };

  return <div className="grid">{renderGrid()}</div>;
};
