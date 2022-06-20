import { ChildlikeCls } from './fast-maker/ChildlikeCls';
import { FlakyCls } from './fast-maker/FlakyCls';

const case002 = {
  flakyCase002: new FlakyCls(),
  childlikeCase002: new ChildlikeCls(),
  nameCase002: 'case001',
};

export const flakyCase002 = case002.flakyCase002;
export const childlikeCase002 = case002.childlikeCase002;
export const nameCase002 = case002.nameCase002;
