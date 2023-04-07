import React, { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";

import { Board } from "../Board/Board";
import { useGame } from "./useGame";
import { TILES_PER_ROW } from "../Board/BoardContext";

export const animationDuration = 250;

export const Game = () => {
  const {tiles, moveLeft, moveRight, moveUp, moveDown} = useGame();

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
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

  return <Board tiles={tiles} tileCountPerRow={TILES_PER_ROW} />;
};
