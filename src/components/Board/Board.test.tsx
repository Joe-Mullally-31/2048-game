import { render, screen } from "@testing-library/react";
import { Board } from "./Board";
import { addIdsToMatrix } from "../Game/useGame.test";
import { TILES_PER_ROW } from "./BoardContext";

describe("Board", () => {
  it("should only display tiles with values > 0", () => {
    const tilesMatrix = addIdsToMatrix([
      [2, 0, 2, 2],
      [2, 0, 0, 2],
      [2, 4, 0, 4],
      [4, 2, 0, 4],
    ]);
    render(
      <Board tilesMatrix={tilesMatrix} tileCountPerRow={TILES_PER_ROW}/>
    );

    const numberOfTwos = screen.queryAllByText("2").length;
    const numberOfFours = screen.queryAllByText("4").length;
    const numberZeroes = screen.queryAllByText("0").length;

    expect(numberOfFours).toBe(4);
    expect(numberOfTwos).toBe(7);
    expect(numberZeroes).toBe(0);
  });
});
