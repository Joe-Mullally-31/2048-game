import React, { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";

import { Board } from "../Board/Board";
import { Direction, useGame } from "./useGame";
import { TILES_PER_ROW } from "../Board/BoardContext";
import { Button } from "../Button/Button";
import "./game.css";

export const animationDuration = 250;

export const Game = () => {
  const { tilesMatrix, move, gameOver, gameWon, resetGame } = useGame();

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        move(Direction.LEFT);
        break;
      case "ArrowRight":
        move(Direction.RIGHT);
        break;
      case "ArrowUp":
        move(Direction.UP);
        break;
      case "ArrowDown":
        move(Direction.DOWN);
        break;
    }
  };

  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  return (
    <>
      <div className="header">
        <div>
          <h1>Play 2048</h1>
        </div>
        <div>
          <Button onClick={resetGame}>Restart</Button>
        </div>
      </div>
      <Board tilesMatrix={tilesMatrix} tileCountPerRow={TILES_PER_ROW} />
      {gameOver && (
        <>
          <div className="modal-overlay"></div>
          <div className="modal">
            <h2>Game Over</h2>
            <Button onClick={resetGame}>Restart</Button>
          </div>
        </>
      )}
      {gameWon && (
        <>
          <div className="modal-overlay"></div>
          <div className="modal">
            <h2>You won!</h2>
            <Button onClick={resetGame}>Restart</Button>
          </div>
        </>
      )}
    </>
  );
};
