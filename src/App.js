import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import RouletteCircle from './components/RouletteCircle/RouletteCircle';
import ControlPanel from './components/ControlPanel/ControlPanel';
import { ACCELERATION_MOVE, DEFAULT_USER_BALANCE, FAST_MOVE, GAME_LOG, USER_BALANCE } from './constants';

function App() {
  const [wheelMoveType, setMoveType] = useState(ACCELERATION_MOVE);
  const wheel = useRef(null);

  const setWheelObject = (wheelObject) => {
    wheel.current = wheelObject;
  };

  const changeWheelMoveType = (e) => {
    setMoveType(e.target.value);
    wheel.current.wheelMoveType = e.target.value;
  };

  useEffect(() => {
    if (!localStorage.getItem(USER_BALANCE)) localStorage.setItem(USER_BALANCE, `${DEFAULT_USER_BALANCE}`);
    if (!localStorage.getItem(GAME_LOG)) localStorage.setItem(GAME_LOG, JSON.stringify([]));
  }, []);

  return (
    <div className="App">
      <form onChange={changeWheelMoveType} onSubmit={(e) => {e.preventDefault()}} className="wheelBehavior">
        <label><input type="radio" value={FAST_MOVE} checked={wheelMoveType === FAST_MOVE} />Fast Move</label>
        <label><input type="radio" value={ACCELERATION_MOVE} checked={wheelMoveType === ACCELERATION_MOVE} />Acceleration Type Move</label>
      </form>
      <RouletteCircle setWheelObject={setWheelObject} />
      <ControlPanel wheel={wheel} />
    </div>
  );
}

export default App;
