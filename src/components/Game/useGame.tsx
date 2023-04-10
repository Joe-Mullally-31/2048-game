import { useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { TILES_PER_ROW } from "../Board/BoardContext";
import {
  TileInMatrix,
  rotateMatrixRight,
  shiftMatrixRight,
} from "./matrixUtils";
import { v4 as uuidv4 } from "uuid";

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export const useGame = () => {
  const buildEmptyBoard = (): TileInMatrix[][] =>
    Array.from(
      {
        length: TILES_PER_ROW,
      },
      () => new Array(TILES_PER_ROW).fill({ value: 0 })
    );
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [tilesMatrix, setTilesMatrix] = useState<TileInMatrix[][]>(
    buildEmptyBoard()
  );

  // highlight new tiles and merged tiles
  const [tilesToHighlight, setTilesToHighlight] = useState<[number, number][]>(
    []
  );

  const shiftAndCombineRight = (matrix: TileInMatrix[][]) => {
    const shiftedMatrix = shiftMatrixRight(matrix);
    console.log({ shiftedMatrix });

    type CombineLineState = {
      newRow: TileInMatrix[];
      lastTile: TileInMatrix | undefined;
    };

    const combineLine = (row: TileInMatrix[]) => {
      const state = row.reduceRight<CombineLineState>(
        ({ lastTile, newRow }, next) => {
          if (lastTile === undefined) {
            return { newRow, lastTile: next };
          }

          if (next.value > 0 && next.value === lastTile.value) {
            return {
              newRow: [{ value: next.value * 2, id: next.id }, ...newRow],
              lastTile: undefined,
            };
          }
          return { newRow: [lastTile, ...newRow], lastTile: next };
        },
        { newRow: [], lastTile: undefined }
      );
      const combinedRow =
        state.lastTile !== undefined
          ? [state.lastTile, ...state.newRow]
          : [{ value: 0, id: undefined }, ...state.newRow];

      // pad with zeros
      return [
        ...new Array<TileInMatrix>(row.length - combinedRow.length).fill({
          value: 0,
          id: undefined,
        }),
        ...combinedRow,
      ];
    };
    return shiftedMatrix.map(combineLine);
  };

  const noMergesPossible = (tilesMatrix: TileInMatrix[][]) => {
    const checkForHorizontalMerges = shiftAndCombineRight(tilesMatrix);
    const checkForVerticalMerges = rotateMatrixRight<TileInMatrix>(
      shiftAndCombineRight(rotateMatrixRight(tilesMatrix)),
      3
    );
    return (
      isEqual(tilesMatrix, checkForHorizontalMerges) &&
      isEqual(tilesMatrix, checkForVerticalMerges)
    );
  };

  const getEmptyTiles = (tilesMatrix: TileInMatrix[][]) => {
    const emptyTiles: [number, number][] = [];
    tilesMatrix.forEach((row, rowIndex) =>
      row.forEach((tile, colIndex) => {
        if (tile.value === 0) {
          emptyTiles.push([rowIndex, colIndex]);
        }
      })
    );
    return emptyTiles;
  };

  const addRandomTile = (tilesMatrix: TileInMatrix[][]) => {
    const emptyTiles = getEmptyTiles(tilesMatrix);
    if (emptyTiles.length === 0) {
      return;
    }
    const randomZeroCoordinates =
      emptyTiles[Math.round(Math.random() * (emptyTiles.length - 1))];

    setTilesToHighlight([...tilesToHighlight, randomZeroCoordinates]);

    const newMatrix = [...tilesMatrix];
    newMatrix[randomZeroCoordinates[0]][randomZeroCoordinates[1]] = {
      value: 2,
      id: uuidv4(),
    };
    return newMatrix;
  };

  const addRandomTileAndCheckGameState = (tilesMatrix: TileInMatrix[][]) => {
    if (
      [...tilesMatrix]
        .flat()
        .map(({ value }) => value)
        .includes(2048)
    ) {
      setGameWon(true);
      return tilesMatrix;
    }

    const newTilesMatrixWithNewTile = addRandomTile([...tilesMatrix]);
    if (
      !newTilesMatrixWithNewTile ||
      noMergesPossible(newTilesMatrixWithNewTile)
    ) {
      setGameOver(true);
      return tilesMatrix;
    }
    return newTilesMatrixWithNewTile;
  };

  const resetGame = () => {
    const initialBoard = addRandomTileAndCheckGameState(
      addRandomTileAndCheckGameState(buildEmptyBoard())
    );
    setTilesMatrix(initialBoard);
  };

  // Randomly generate board on page load
  useEffect(() => {
    resetGame();
  }, []);

  const move = (
    direction: Direction,
    addTileAndCheckGameState: (
      tilesMatrix: TileInMatrix[][]
    ) => TileInMatrix[][] = addRandomTileAndCheckGameState
  ) => {
    setTilesToHighlight([]);

    let newTilesMatrix: TileInMatrix[][];
    let rotatedMatrix: TileInMatrix[][];
    let combinedMatrix: TileInMatrix[][];

    switch (direction) {
      case Direction.RIGHT:
        newTilesMatrix = shiftAndCombineRight(tilesMatrix);
        break;
      case Direction.LEFT:
        rotatedMatrix = rotateMatrixRight(tilesMatrix, 2);
        combinedMatrix = shiftAndCombineRight(rotatedMatrix);
        newTilesMatrix = rotateMatrixRight(combinedMatrix, 2);
        break;
      case Direction.UP:
        rotatedMatrix = rotateMatrixRight(tilesMatrix);
        combinedMatrix = shiftAndCombineRight(rotatedMatrix);
        newTilesMatrix = rotateMatrixRight(combinedMatrix, 3);
        break;
      case Direction.DOWN:
        rotatedMatrix = rotateMatrixRight(tilesMatrix, 3);
        combinedMatrix = shiftAndCombineRight(rotatedMatrix);
        newTilesMatrix = rotateMatrixRight(combinedMatrix);
        break;
    }

    if (isEqual(newTilesMatrix, tilesMatrix)) {
      return;
    }
    const newTilesMatrixWithNewTile = addTileAndCheckGameState(newTilesMatrix);
    setTilesMatrix(newTilesMatrixWithNewTile);
  };

  return {
    move,
    tilesMatrix,
    setTilesMatrix,
    gameOver,
    gameWon,
    resetGame,
    tilesToHighlight,
  };
};
