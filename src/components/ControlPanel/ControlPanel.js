import React, { useState, useEffect, useCallback } from 'react';
import style from './ControlPanel.module.scss';
import {
  BLACK_COLOR_MULTIPLE, BLACK_COLOR_VALUE, DEFAULT_USER_BALANCE, GAME_LOG,
  GREEN_COLOR_MULTIPLE, GREEN_COLOR_VALUE,
  MAX_BET,
  MIN_BET,
  RED_COLOR_MULTIPLE, RED_COLOR_VALUE,
  USER_BALANCE
} from '../../constants';
import BetButton from './BetButton';
import { isInteger } from '../../utils/helpers';
import { getSpineRouletteResult } from '../../webAPI/webApi';

const ControlPanel = ({wheel}) => {

  const [balance, setBalance] = useState(0);
  const [betValue, setBetValue] = useState(1);
  const [isGameStarting, setStartingGame] = useState(false);

  const spinButtonClickHandler = useCallback(async (multipleValue, betColor) => {
    setStartingGame(true);
    const result = await getSpineRouletteResult();
    changeBalance(balance - betValue);
    const spinResult = await new Promise((resolve) => wheel.current.rotateWheel(result, (result) => resolve(result)));
    rotateWheelResultHandler({newBalance: balance - betValue, betColor, betValue, multipleValue, spinResult});
    setStartingGame(false);
  }, [wheel, balance]);

  const rotateWheelResultHandler = useCallback(({newBalance, betColor, betValue, multipleValue, spinResult}) => {
    if (betColor === spinResult.color) changeBalance(newBalance + (betValue*multipleValue));
    addLog({
      betColor,
      betValue,
      isWinGame: betColor === spinResult.color
    });
  }, []);

  const onChangeValue = useCallback((e) => {
    if (!e || !isInteger(e.target.value) || e.target.value < MIN_BET || e.target.value > balance || e.target.value > MAX_BET) return;
    setBetValue(e.target.value);
  }, []);

  const betButtonHandler = useCallback((value) => {
    onChangeValue({target: {value: value ? betValue + 1 : betValue - 1}})
  }, []);

  const changeBalance = useCallback((value) => {
    setBalance(value);
    localStorage.setItem(USER_BALANCE, `${value}`)
  }, []);

  const addLog = useCallback((newLog) => {
      const gameLog = JSON.parse(localStorage.getItem(GAME_LOG));
      if (gameLog) gameLog.push(newLog);
      localStorage.setItem(GAME_LOG, JSON.stringify(gameLog || [newLog]))
  }, []);

  useEffect(() => {
    const balance = localStorage.getItem(USER_BALANCE);
    if (!balance) localStorage.setItem(USER_BALANCE, `${DEFAULT_USER_BALANCE}`);

    setBalance(balance !== null ? balance : +DEFAULT_USER_BALANCE)
  }, []);

  return <form className={style.controlPanel} onSubmit={(e) => e.preventDefault()}>
    <section className={style.betChoseButtons}>
      <button
        onClick={() => {onChangeValue({target: {value: 1}})}}
        disabled={balance < MIN_BET || isGameStarting}
      >
        Мин
      </button>
      <button
        onClick={() => {onChangeValue({target: {value: betValue * 2}})}}
        disabled={balance < betValue * 2 || isGameStarting}
      >
        х2
      </button>
      <button
        onClick={() => {onChangeValue({target: {value: (balance/2).toFixed() > 1 ? (balance/2).toFixed() : 1}})}}
        disabled={balance < MIN_BET || isGameStarting}
      >
        1/2
      </button>
      <button
        onClick={() => {onChangeValue({target: {value: balance}})}}
        disabled={balance < MIN_BET || balance > MAX_BET || isGameStarting}
      >
        На все
      </button>
    </section>

    <section className={style.balance}>Balance: {balance}</section>

    <section className={style.betValueControl}>
      <button onClick={() => {betButtonHandler(false)}} disabled={isGameStarting}>-</button>
      <input type="text" onInput={onChangeValue} value={betValue}/>
      <button onClick={() => {betButtonHandler(true)}} disabled={isGameStarting}>+</button>
    </section>

    <section className={style.infoBlock}>
      <span>Ставка</span>
      <span>Мин: {MIN_BET} Макс: {MAX_BET}</span>
    </section>

    <section className={style.betColorChose}>
      <BetButton
        onClick={() => {spinButtonClickHandler(RED_COLOR_MULTIPLE, RED_COLOR_VALUE)}}
        betValue={betValue}
        multipleValue={RED_COLOR_MULTIPLE}
        backgroundColor={RED_COLOR_VALUE}
        disabled={balance < MIN_BET || isGameStarting}
      />
      <BetButton
        onClick={() => {spinButtonClickHandler(GREEN_COLOR_MULTIPLE, GREEN_COLOR_VALUE)}}
        betValue={betValue}
        multipleValue={GREEN_COLOR_MULTIPLE}
        backgroundColor={GREEN_COLOR_VALUE}
        disabled={balance < MIN_BET || isGameStarting}
      />
      <BetButton
        onClick={() => {spinButtonClickHandler(BLACK_COLOR_MULTIPLE, BLACK_COLOR_VALUE)}}
        betValue={betValue}
        multipleValue={BLACK_COLOR_MULTIPLE}
        backgroundColor={BLACK_COLOR_VALUE}
        disabled={balance < MIN_BET || isGameStarting}
      />
    </section>
  </form>
};

export default ControlPanel;
