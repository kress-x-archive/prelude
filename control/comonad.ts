import Kind, { Ap } from "../kind.ts";
import Extend, { testExtend } from "./extend.ts";
import { AssertEquals } from "../test/asserts.ts";

export interface Comonad<T extends Kind> extends Extend<T> {
  extract: <a>(t: Ap<T, a>) => a;
}

export default Comonad;

export const assertComonad = <T extends Kind, A, B, C>(
  args:
    & Comonad<T>
    & {
      assertEquals: AssertEquals;
      a: Ap<T, A>;
      w: Ap<T, A>;
      f: (b: Ap<T, B>) => C;
      g: (a: Ap<T, A>) => B;
    },
) => {
  testExtend<T, A, B, C>(args);

  const { extract, extend, assertEquals, w, f } = args;

  assertEquals(
    extend<A, A>(extract, w),
    w,
    "comonad left identity law",
  );

  assertEquals(
    extract<C>(extend<B, C>(f, w)),
    f(w),
    "comonad right identity law",
  );
};
