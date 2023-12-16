import { default as BigNumber } from 'bignumber.js';

export function nanoToRaw(amount: number, decimal = 30) {
  let value = new BigNumber(amount.toString());
  return value.shiftedBy(decimal).toFixed(0);
};

export function rawToNano(amount: number, decimal = 30) {
  let value = new BigNumber(amount.toString());
  return value.shiftedBy(-(decimal)).toFixed(decimal, 1);
};
