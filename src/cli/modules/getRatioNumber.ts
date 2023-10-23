import { bignumber } from 'mathjs';

export function getRatioNumber(num: number, base: 1 | 100 = 1) {
  return bignumber(1)
    .sub(bignumber(num))
    .mul(100 * base)
    .floor()
    .div(100)
    .toNumber();
}
