import * as Lazy from "./_lazy.ts";
import LazyListT, * as LazyList from "./_lazylist.ts";
import type RoseTreeT from "./_rosetree.ts";

export default interface SimplifyT<A> {
  (a: A): LazyListT<A>;
}

export const simplifyTree = <A>(
  simplify: SimplifyT<A>,
  root: A,
): RoseTreeT<A> => ({
  root,
  children: Lazy.ofThunk(() =>
    Lazy.extract(
      LazyList.map((node) => simplifyTree(simplify, node), simplify(root)),
    )
  ),
});
