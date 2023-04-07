import React, { useContext, useEffect, useState } from "react";
import "./tile.css";
import { BoardContext } from "../Board/BoardContext";
import usePrevious from "../../hooks/usePrevious";

const TILE_WIDTH = 100;
const TILE_MARGIN = 16;

export const TILE_TOTAL_WIDTH = TILE_WIDTH + TILE_MARGIN;

export type TileInfo = {
  id: number;
  xPosition: number;
  yPosition: number;
  value: number;
  mergeWith?: number;
};

type TileProps = {
  tileInfo: TileInfo;
};

export const Tile = ({ tileInfo }: TileProps) => {
  const { value, xPosition, yPosition, id } = tileInfo;
  const { containerWidth, tileCount } = useContext(BoardContext);

  const [scale, setScale] = useState<number>(1);

  const previousValue = usePrevious<number>(value);

  const isNew = previousValue === undefined;
  const hasChanged = previousValue !== value;
  const highlightTile = isNew || hasChanged;

  useEffect(() => {
    if (highlightTile) {
      setScale(1.1);
      const timeOut = setTimeout(() => setScale(1), 100);
      return () => clearTimeout(timeOut);
    }
  }, [highlightTile, scale]);

  const positionToPixels = (position: number) => {
    return (position / tileCount) * containerWidth;
  };

  const style = {
    top: positionToPixels(yPosition),
    left: positionToPixels(xPosition),
    transform: `scale(${scale})`,
    zIndex: id,
  };

  return (
    <div className={`tile tile-${value}`} style={style}>
      {value}
    </div>
  );
};
