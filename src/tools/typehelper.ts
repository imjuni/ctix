import * as TEI from 'fp-ts/Either';
import * as TTE from 'fp-ts/TaskEither';

export type TResolvedTaskEither<T extends TTE.TaskEither<any, any>> = [T] extends [
  TTE.TaskEither<any, infer U>,
]
  ? U
  : never;
export type TResolvedPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
export type TResolvedEither<T extends TEI.Either<any, any>> = [T] extends [TEI.Either<any, infer U>]
  ? U
  : never;

export function taskEitherLiftor<X, Y, Z>(f: (args: X) => Promise<TEI.Either<Y, Z>>) {
  return (args: X): TTE.TaskEither<Y, Z> =>
    () =>
      f(args);
}
