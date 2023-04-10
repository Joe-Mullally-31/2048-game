import { renderHook, waitFor } from "@testing-library/react";
import { Direction, useGame } from "./useGame";
import { act } from "react-dom/test-utils";
import { TileInMatrix } from "./matrixUtils";

jest.useFakeTimers();
jest.mock("uuid", () => ({ v4: () => undefined }));

// mock this function so that it doesn't add a random tile into the matrix
// makes testing moving in each direction clearer and easier
const mockAddTileAndCheckGameState = (tilesMatrix: TileInMatrix[][]) =>
  tilesMatrix;

export const addIdsToMatrix = (tilesMatrix: number[][]): TileInMatrix[][] => {
  return tilesMatrix.map((row) =>
    row.map((value) => {
      return { value: value, id: undefined };
    })
  );
};

describe("useGame", () => {
  describe("move right", () => {
    it("should move tiles right", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [2, 0, 0, 0],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 2],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
    it("should move any tiles if no space to move and none merge", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 4],
        [0, 2, 4, 8],
        [2, 4, 8, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 4],
        [0, 2, 4, 8],
        [2, 4, 8, 4],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
    it("should not merge any tiles if no tiles to merge", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 4],
        [0, 2, 0, 4],
        [2, 0, 8, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 4],
        [0, 0, 2, 4],
        [0, 2, 8, 4],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
    it("should move tiles right and merge equal numbers next to each other", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 2],
        [0, 2, 2, 0],
        [2, 2, 0, 0],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 0, 4],
        [0, 0, 0, 4],
        [0, 0, 0, 4],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
    it("should move tiles right and merge equal numbers not next to each other but on same row", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [2, 0, 0, 2],
        [0, 2, 0, 2],
        [2, 0, 2, 0],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 0, 4],
        [0, 0, 0, 4],
        [0, 0, 0, 4],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );
      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
    it("should merge the two rightmost numbers if 3 of the same number in a row", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 2, 2, 2],
        [2, 2, 2, 0],
        [2, 2, 0, 2],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 2],
        [0, 0, 2, 4],
        [0, 0, 2, 4],
        [0, 0, 2, 4],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
    it("should handle 2 pairs of the same number next to each other", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [2, 2, 2, 2],
        [2, 2, 4, 4],
        [2, 4, 2, 4],
        [4, 2, 2, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 4, 4],
        [0, 0, 4, 8],
        [2, 4, 2, 4],
        [0, 4, 4, 4],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.RIGHT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
  });
  describe("moveUp", () => {
    it("should move tiles up", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [2, 0, 2, 2],
        [2, 0, 0, 2],
        [2, 4, 0, 4],
        [4, 2, 0, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [4, 4, 2, 4],
        [2, 2, 0, 8],
        [4, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.UP, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
  });
  describe("moveDown", () => {
    it("should move tiles down", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [2, 0, 2, 2],
        [2, 0, 0, 2],
        [2, 4, 0, 4],
        [4, 2, 0, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 4, 0, 4],
        [4, 2, 2, 8],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.DOWN, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
  });
  describe("moveLeft", () => {
    it("should move tiles left", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [2, 0, 2, 2],
        [2, 0, 0, 2],
        [2, 4, 0, 4],
        [4, 2, 0, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [4, 2, 0, 0],
        [4, 0, 0, 0],
        [2, 8, 0, 0],
        [4, 2, 4, 0],
      ]);
      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() =>
        result.current.move(Direction.LEFT, mockAddTileAndCheckGameState)
      );

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
    });
  });

  describe("gameWon", () => {
    it("returns gameWon to true when a tile is 2048", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [1024, 0, 1024, 2],
        [2, 0, 0, 2],
        [2, 4, 0, 4],
        [4, 2, 0, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [2048, 2, 0, 0],
        [4, 0, 0, 0],
        [2, 8, 0, 0],
        [4, 2, 4, 0],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() => result.current.move(Direction.LEFT));
      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
      const matrixValues = result.current.tilesMatrix
        .flat()
        .map(({ value }) => value);

      expect(matrixValues.includes(2048)).toBe(true);
      expect(result.current.gameWon).toBe(true);
    });
  });

  describe("gameOver", () => {
    it("should set gameOver to true when all tiles full and no merges possible", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [0, 4, 2, 4],
        [8, 4, 2, 8],
        [2, 8, 4, 2],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [4, 2, 4, 2],
        [8, 4, 2, 8],
        [2, 8, 4, 2],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() => result.current.move(Direction.LEFT));

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
      expect(result.current.gameOver).toBe(true);
    });

    it("should not set gameOver to false when all tiles full but vertical merges are possible", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [0, 4, 2, 4],
        [8, 4, 2, 8],
        [2, 4, 2, 4],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [4, 2, 4, 2],
        [8, 4, 2, 8],
        [2, 4, 2, 4],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() => result.current.move(Direction.LEFT));

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
      expect(result.current.gameOver).toBe(false);
    });

    it("should not set gameOver to false when all tiles full but horizontal merges are possible", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [0, 4, 16, 2],
        [8, 4, 2, 8],
        [2, 8, 4, 16],
      ]);
      const expectedTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [4, 16, 2, 2],
        [8, 4, 2, 8],
        [2, 8, 4, 16],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() => result.current.move(Direction.LEFT));

      await waitFor(() =>
        expect(result.current.tilesMatrix).toStrictEqual(expectedTileMatrix)
      );
      expect(result.current.gameOver).toBe(false);
    });
  });

  describe("resetGame", () => {
    it("should reset game to just two tiles", () => {
      const initialTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [0, 4, 16, 2],
        [8, 4, 2, 8],
        [2, 8, 4, 16],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));

      act(() => result.current.resetGame());

      const resetTileMatrix = result.current.tilesMatrix;
      const numberOfTwos = resetTileMatrix
        .flat()
        .filter(({ value }) => value === 2).length;
      const numberOfZeroes = resetTileMatrix
        .flat()
        .filter(({ value }) => value === 0).length;

      expect(numberOfTwos).toBe(2);
      expect(numberOfZeroes).toBe(14);
    });

    it("should reset game on first init", () => {
      const { result } = renderHook(() => useGame());

      const tileMatrix = result.current.tilesMatrix;
      const numberOfTwos = tileMatrix
        .flat()
        .filter(({ value }) => value === 2).length;
      const numberOfZeroes = tileMatrix
        .flat()
        .filter(({ value }) => value === 0).length;

      expect(numberOfTwos).toBe(2);
      expect(numberOfZeroes).toBe(14);
    });

    it("should set gameOver to false after resetting", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [8, 4, 2, 8],
        [0, 4, 2, 4],
        [8, 4, 2, 8],
        [2, 8, 4, 2],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));
      act(() => result.current.move(Direction.LEFT));
      expect(result.current.gameOver).toBe(true);

      result.current.resetGame();

      await waitFor(() => expect(result.current.gameOver).toBe(false));
    });

    it("should set gameWon to false after resetting", async () => {
      const initialTileMatrix = addIdsToMatrix([
        [1024, 1024, 2, 8],
        [0, 4, 2, 4],
        [8, 4, 2, 8],
        [2, 8, 4, 2],
      ]);

      const { result } = renderHook(() => useGame());
      act(() => result.current.setTilesMatrix(initialTileMatrix));
      act(() => result.current.move(Direction.LEFT));
      expect(result.current.gameWon).toBe(true);

      result.current.resetGame();

      await waitFor(() => expect(result.current.gameWon).toBe(false));
    });
  });
});
