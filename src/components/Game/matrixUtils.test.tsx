import { rotateMatrixRight } from "./matrixUtils";

describe("matrixUtils", () => {
  describe("rotateMatrixRight", () => {
    it("rotates matrix right once by default", () => {
      const initialTileMatrix = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const expectedTileMatrix = [
        [13, 9, 5, 1],
        [14, 10, 6, 2],
        [15, 11, 7, 3],
        [16, 12, 8, 4],
      ];

      expect(rotateMatrixRight(initialTileMatrix)).toStrictEqual(
        expectedTileMatrix
      );
    });

    it("rotates matrix right by number of times required", () => {
      const initialTileMatrix = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const expectedTileMatrix = [
        [16, 15, 14, 13],
        [12, 11, 10, 9],
        [8, 7, 6, 5],
        [4, 3, 2, 1],
      ];

      expect(rotateMatrixRight(initialTileMatrix, 2)).toStrictEqual(
        expectedTileMatrix
      );
    });
  });
});
