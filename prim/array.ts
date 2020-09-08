import * as array from "../data/array.ts";

export const empty = array.empty as <A>() => A[];

export const equals = array.equals as <A>(
  x: A[],
  y: A[],
) => boolean;

export const concat = array.concat as unknown as <A>(
  x: A[],
  y: A[],
) => A[];

export const invert = array.invert as unknown as <A>(
  t: A[],
) => A[];

export const map = array.map as unknown as <A, B>(
  f: (x: A) => B,
  t: A[],
) => B[];

export const reduce = array.reduce as <A, B>(
  f: (x: A, y: B) => A,
  x: A,
  u: B[],
) => A;

export const filter = array.filter as unknown as <A>(
  pred: (x: A) => boolean,
  ta: A[],
) => A[];

export const ap = array.ap as unknown as <A, B>(
  tf: ((x: A) => B)[],
  ta: A[],
) => B[];

export const of = array.of as unknown as <A>(x: A) => A[];

export const chain = array.chain as unknown as <A, B>(
  f: (x: A) => B[],
  t: A[],
) => B[];

export const join = array.join as unknown as <A>(
  tt: A[][],
) => A[];
