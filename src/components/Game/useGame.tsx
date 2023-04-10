import { useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { TILES_PER_ROW } from "../Board/BoardContext";
import {
  MergedTile,
  TileInMatrix,
  rotateMatrixRight,
  shiftMatrixRight,
} from "./matrixUtils";
import { v4 as uuidv4 } from "uuid";
import { animationDuration } from "./Game";

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
      () => new Array(TILES_PER_ROW).fill({ value: 0, id: undefined })
    );
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [tilesMatrix, setTilesMatrix] = useState<TileInMatrix[][]>(
    buildEmptyBoard()
  );

  const shiftAndCombineRight = (matrix: TileInMatrix[][]): MergedTile[][] => {
    const shiftedMatrix = shiftMatrixRight(matrix);

    type CombineLineState = {
      newRow: MergedTile[];
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
              newRow: [
                { value: next.value * 2, oldValue: next.value, id: next.id },
                ...newRow,
              ],
              lastTile: undefined,
            };
          }
          return {
            newRow: [{ ...lastTile }, ...newRow],
            lastTile: next,
          };
        },
        { newRow: [], lastTile: undefined }
      );
      const combinedRow =
        state.lastTile !== undefined
          ? [state.lastTile, ...state.newRow]
          : [{ value: 0, id: undefined }, ...state.newRow];

      // pad with zeros
      return [
        ...new Array<MergedTile>(row.length - combinedRow.length).fill({
          value: 0,
          id: undefined,
        }),
        ...combinedRow,
      ];
    };
    return shiftedMatrix.map(combineLine);
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

  const noMergesPossible = (tilesMatrix: TileInMatrix[][]) => {
    const emptyTiles = getEmptyTiles(tilesMatrix);
    if (emptyTiles.length > 0) {
      return false;
    }
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

  const addRandomTile = (tilesMatrix: TileInMatrix[][]) => {
    const emptyTiles = getEmptyTiles(tilesMatrix);
    if (emptyTiles.length === 0) {
      return;
    }
    const randomZeroCoordinates =
      emptyTiles[Math.round(Math.random() * (emptyTiles.length - 1))];

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
    setGameOver(false);
    setGameWon(false);
    const initialBoard = addRandomTileAndCheckGameState(
      addRandomTileAndCheckGameState(buildEmptyBoard())
    );
    setTilesMatrix(initialBoard);
  };

  // Randomly generate board on page load
  useEffect(() => {
    resetGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = (
    direction: Direction,
    addTileAndCheckGameState: (
      tilesMatrix: TileInMatrix[][]
    ) => TileInMatrix[][] = addRandomTileAndCheckGameState
  ) => {
    let newTilesMatrix: MergedTile[][];
    let rotatedMatrix: TileInMatrix[][];
    let combinedMatrix: MergedTile[][];

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
    const preCombinationMatrix = newTilesMatrix.map((row) =>
      row.map((merged) => ({
        value: merged.oldValue ?? merged.value,
        id: merged.id,
      }))
    );
    const postCombinationMatrix = newTilesMatrix.map((row) =>
      row.map((merged) => ({
        value: merged.value,
        id: merged.id,
      }))
    );
    setTilesMatrix(preCombinationMatrix);
    const newTilesMatrixWithNewTile = addTileAndCheckGameState(
      postCombinationMatrix
    );
    // Allow the slide animation to complete
    setTimeout(
      () => setTilesMatrix(newTilesMatrixWithNewTile),
      animationDuration
    );
  };

  return {
    move,
    tilesMatrix,
    setTilesMatrix,
    gameOver,
    gameWon,
    resetGame,
  };
};
