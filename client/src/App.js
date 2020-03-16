import React, { useState, useEffect } from "react";
import "./App.css";
import World from "./World";
import Leaderboard from "./Leaderboard";

async function LoadData(callback) {
  const r = await fetch("http://127.0.0.1:3000/");
  return r.json();
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    LoadData().then(data => setData(data));
  }, []);

  return (
    <div className="app">
      <Leaderboard style={{ position: "absolute" }} cPoints={data} />
      <World style={{ position: "relative" }} cPoints={data} />
    </div>
  );
}

export default App;
