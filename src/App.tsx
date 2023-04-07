import React, { useState } from "react";

import "./App.css";
import { Game } from "./components/Game/Game";
import { Button } from "./components/Button/Button";

const App = () => {
  const [date, setDate] = useState<Date>(new Date());

  const handleRestart = () => {
    setDate(new Date());
  };

  return (
    <div className="App">
      <div className="header">
        <div>
          <h1>Play 2048</h1>
        </div>
        <div>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      </div>
      <Game key={date.toISOString()} />
    </div>
  );
};

export default App;
