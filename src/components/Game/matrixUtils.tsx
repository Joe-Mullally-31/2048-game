export type TileInMatrix = {
  value: number;
  id: string | undefined;
};

export const rotateMatrixRight = <T,>(
  matrix: T[][],
  numberOfRotations = 1
): T[][] => {
  const newMatrix = [];
  const len = matrix.length;

  for (let col = 0; col < len; col++) {
    const newRow: T[] = [];
    for (let row = len - 1; row >= 0; row--) {
      const next = matrix[row][col];
      newRow.push(next);
    }
    newMatrix.push([...newRow]);
  }

  const newNumberOfRotations = numberOfRotations - 1;
  return newNumberOfRotations === 0
    ? newMatrix
    : rotateMatrixRight(newMatrix, newNumberOfRotations);
};

export const shiftMatrixRight = (matrix: TileInMatrix[][]) => {
  const shiftedMatrix: TileInMatrix[][] = [];

  matrix.forEach((row) => {
    const boardRow: TileInMatrix[] = [];
    row.forEach((tileInMatrix) => {
        tileInMatrix.value === 0
        ? boardRow.unshift(tileInMatrix)
        : boardRow.push(tileInMatrix);
    });
    shiftedMatrix.push(boardRow);
  });
  return shiftedMatrix;
};

