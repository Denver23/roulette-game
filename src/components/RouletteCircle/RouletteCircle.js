import React, { useEffect, useRef, useCallback } from 'react';
import { canvasHeight, canvasWidth, CELLS_QUANTITY } from '../../constants';
import wheel from '../../utils/wheel';
import style from './RouletteCircle.module.scss';

const RouletteCircle = ({setWheelObject}) => {
  const rouletteWheel = useRef({});
  const rouletteCanvas = useRef(null);

  useEffect(() => {
    createCanvasRoulette();
    setWheelObject(rouletteWheel.current);
  }, []);

  const createCanvasRoulette = useCallback(() => {
    const ctx = rouletteCanvas.current.getContext('2d');
    rouletteWheel.current = new wheel(canvasWidth/2, canvasHeight/2, 200, CELLS_QUANTITY);
    rouletteWheel.current.draw(ctx);
  }, []);

  return <div className={style.wheelContainer}>
    <div className={style.wheelArrow}></div>
    <canvas className={style.wheel} ref={rouletteCanvas} width={canvasWidth} height={canvasHeight}/>
  </div>
};

export default RouletteCircle;
