const regexp = /^\d+$/;
export const isInteger = value => (regexp.test(value));

export const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};
