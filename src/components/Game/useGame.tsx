import { useState } from "react";
import { TileInfo } from "../Tile/Tile";

export const useGame = () => {
  const [tiles, setTiles] = useState<TileInfo[]>([
    // origin is top left
    {
      id: 0,
      // top left
      xPosition: 0,
      yPosition: 0,
      value: 8,
    },
    {
      id: 0,
      xPosition: 0,
      yPosition: 1,
      value: 128,
    },
    {
      id: 0,
      xPosition: 1,
      yPosition: 1,
      value: 2,
    },
    {
      id: 0,
      xPosition: 1,
      yPosition: 0,
      value: 2,
    },
    {
      id: 0,
      xPosition: 2,
      yPosition: 1,
      value: 2,
    },
    {
      id: 0,
      xPosition: 1,
      yPosition: 2,
      value: 4,
    },
    {
      id: 0,
      xPosition: 2,
      yPosition: 2,
      value: 2,
    },
    {
      id: 0,
      xPosition: 3,
      yPosition: 0,
      value: 2,
    },
    {
      id: 0,
      xPosition: 3,
      yPosition: 1,
      value: 32,
    },
    {
      id: 0,
      xPosition: 3,
      yPosition: 3,
      value: 2,
    },
    {
      id: 0,
      xPosition: 1,
      yPosition: 3,
      value: 16,
    },
    {
      id: 0,
      xPosition: 2,
      yPosition: 3,
      value: 8,
    },
    {
      id: 0,
      xPosition: 3,
      yPosition: 2,
      value: 4,
    },
    {
      id: 0,
      xPosition: 0,
      yPosition: 2,
      value: 2,
    },
    {
      id: 0,
      xPosition: 2,
      yPosition: 0,
      value: 2048,
    },
  ]);

  const moveLeft = () => {
    const newBoard = [];
    
  };

  const moveRight = () => {};
  const moveUp = () => {};
  const moveDown = () => {};

  return { moveDown, moveLeft, moveUp, moveRight, tiles };
};
