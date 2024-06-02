import { ChildlikeCls } from './fast-maker/ChildlikeCls';
import { FlakyCls } from './fast-maker/FlakyCls';

const case001 = {
  flaky: new FlakyCls(),
  childlike: new ChildlikeCls(),
  nameCase001: 'case001',
};

export const { flaky, childlike, nameCase001 } = case001;
