import { randomInteger } from '../utils/helpers';
import { CELLS_QUANTITY } from '../constants';

export const getSpineRouletteResult = () => new Promise((resolve) => {setTimeout(() => {
  resolve(randomInteger(0, CELLS_QUANTITY - 1))
}, 200)});
