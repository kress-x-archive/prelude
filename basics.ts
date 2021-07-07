export const identity = <A>(a: A): A => a;

export const always = <A>(a: A) => (): A => a;

export * from "./basics/compose.ts";

export * from "./basics/pipe.ts";

export const apply = <Args extends unknown[], Left extends unknown[], R>(
  f: (...args: [...Args, ...Left]) => R,
  ...applied: Args
) => (...left: Left) => f(...applied, ...left);

export const flip = <A, B, Args extends [], R>(
  f: (a: A, b: B, ...args: Args) => R,
) => (b: B, a: A, ...args: Args): R => f(a, b, ...args);

export const never = <T>(never: never): T => {
  throw new Error("called never");
};
