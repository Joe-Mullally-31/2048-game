import React from "react";

export const TILES_PER_ROW = 4

export const BoardContext = React.createContext({
  containerWidth: 0,
  tileCount: TILES_PER_ROW,
});

type Props = {
  containerWidth: number;
  tileCount: number;
  children: any;
};

export const BoardProvider = ({
  children,
  containerWidth = 0,
  tileCount = TILES_PER_ROW,
}: Props) => {
  return (
    <BoardContext.Provider value={{ containerWidth, tileCount }}>
      {children}
    </BoardContext.Provider>
  );
};
