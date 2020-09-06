import Kind, { Ap } from "../kind.ts";
import { AssertEquals } from "../test/asserts.ts";
import Functor from "./functor.ts";

export const testFunctor = <T extends Kind, A, B, C>(
  args: Functor<T> & {
    assertEquals: AssertEquals;
    ta: Ap<T, A>;
    f: (a: A) => B;
    g: (b: B) => C;
  },
) => {
  const { map, assertEquals, ta: a, f: g, g: f } = args;

  assertEquals(
    map<A, A>((x: A) => x, a),
    a,
    "functor identity law",
  );

  assertEquals(
    map<A, C>((x: A) => f(g(x)), a),
    map<B, C>(f, map<A, B>(g, a)),
    "functor composition law",
  );
};
