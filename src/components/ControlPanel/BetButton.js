import React from 'react';
import style from './BetButton.module.scss'

const BetButton = ({ betValue, multipleValue, backgroundColor, onClick, disabled }) => (
  <button onClick={onClick} className={style.betButton} style={{ backgroundColor }} disabled={disabled}>
    <span>{betValue}.00</span>
    <span>X{multipleValue}</span>
  </button>);

export default BetButton;
