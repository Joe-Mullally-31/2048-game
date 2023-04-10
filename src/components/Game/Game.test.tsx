import { render, screen } from "@testing-library/react";
import { Game } from "./Game";
import * as hook from "./useGame";

describe("Game", () => {
  it("should show game over modal", () => {
    jest.spyOn(hook, "useGame").mockImplementation(() => ({
      gameOver: true,
      move: jest.fn(),
      tilesMatrix: [[]],
      setTilesMatrix: jest.fn(),
      gameWon: false,
      resetGame: jest.fn(),
    }));
    render(<Game />);
    expect(screen.getByText("Game Over")).toBeInTheDocument();
  });

  it("should show game won modal", async () => {
    jest.spyOn(hook, "useGame").mockImplementation(() => ({
      gameOver: false,
      move: jest.fn(),
      tilesMatrix: [[]],
      setTilesMatrix: jest.fn(),
      gameWon: true,
      resetGame: jest.fn(),
    }));
    render(<Game />);
    expect(await screen.findByText("You won!")).toBeInTheDocument();
  });
});
