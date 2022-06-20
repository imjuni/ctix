import { ChildlikeCls } from './fast-maker/ChildlikeCls';
import { FlakyCls } from './fast-maker/FlakyCls';

const case003 = {
  flakyCase003: new FlakyCls(),
  childlikeCase003: new ChildlikeCls(),
  nameCase003: 'case003',
  arrowCase003: () => 'hello',
  funcCase003: function () {
    return 'hero';
  },
};

export const { flakyCase003, childlikeCase003, nameCase003, arrowCase003, funcCase003 } = case003;
