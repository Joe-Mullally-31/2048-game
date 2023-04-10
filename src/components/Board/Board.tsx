import React from "react";
import "./board.css";
import { BoardProvider, TILES_PER_ROW } from "./BoardContext";
import { Grid } from "../Grid/Grid";
import { TILE_TOTAL_WIDTH, Tile, TileInfo } from "../Tile/Tile";
import { TileInMatrix } from "../Game/matrixUtils";

export const BOARD_MARGIN = 16;

type BoardProps = {
  tilesMatrix: TileInMatrix[][];
  tileCountPerRow: number;
};

export const Board = ({
  tilesMatrix,
  tileCountPerRow = TILES_PER_ROW,
}: BoardProps) => {
  const containerWidth = TILE_TOTAL_WIDTH * tileCountPerRow;
  const boardWidth = containerWidth + BOARD_MARGIN;

  const renderTiles = () => {
    const tiles: TileInfo[] = tilesMatrix
      .map((row, rowIndex) =>
        row.map((tileInMatrix, columnIndex) => {
          const { id, value } = tileInMatrix;
          return {
            id: id,
            xPosition: columnIndex,
            yPosition: rowIndex,
            value: value,
          };
        })
      )
      .flat();

    const filteredTiles = tiles.filter(({ value }) => value > 0);

    return filteredTiles.map((tile) => (
      <Tile key={`tile-${tile.id}`} tileInfo={tile} />
    ));
  };

  return (
    <div className="board" style={{ width: boardWidth }}>
      <BoardProvider
        containerWidth={containerWidth}
        tileCount={tileCountPerRow}
      >
        <div className="tile-container">{renderTiles()}</div>
        <Grid />
      </BoardProvider>
    </div>
  );
};
