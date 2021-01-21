import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(next, replace = false) {
    setMode(next);
    if (replace) {
      return;
    }
    setHistory([next ,...history]);
  }

  function back() {
    if (history.length > 1) {
      history.shift()
      setMode(history[0]);
    }
  }
  return { mode, transition, back };
}