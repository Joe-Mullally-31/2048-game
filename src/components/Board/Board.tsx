import React from "react";
import "./board.css";
import { BoardProvider, TILES_PER_ROW } from "./BoardContext";
import { Grid } from "../Grid/Grid";
import { TILE_TOTAL_WIDTH, Tile, TileInfo } from "../Tile/Tile";

export const BOARD_MARGIN = 16;

type BoardProps = {
  tiles: TileInfo[];
  tileCountPerRow: number;
};

export const Board = ({
  tiles,
  tileCountPerRow = TILES_PER_ROW,
}: BoardProps) => {
  const containerWidth = TILE_TOTAL_WIDTH * tileCountPerRow;
  const boardWidth = containerWidth + BOARD_MARGIN;

  const tileList = tiles.map((tile) => (
    <Tile key={`tile-${tile.id}`} tileInfo={tile} />
  ));

  return (
    <div className="board" style={{ width: boardWidth }}>
      <BoardProvider
        containerWidth={containerWidth}
        tileCount={tileCountPerRow}
      >
        <div className="tile-container">{tileList}</div>
        <Grid />
      </BoardProvider>
    </div>
  );
};
