import * as TE from 'fp-ts/lib/Either';
import * as TTE from 'fp-ts/lib/TaskEither';

export type TResolvedPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
export type TResolvedEither<T extends TE.Either<any, any>> = [T] extends [
  TE.Either<any, infer U>,
]
  ? U
  : never;

export function taskEitherLiftor<X, Y, Z>(f: (args: X) => Promise<TE.Either<Y, Z>>) {
  return (args: X): TTE.TaskEither<Y, Z> => () => f(args);
}
