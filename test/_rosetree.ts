import MaybeT, * as Maybe from "../data/maybe.ts";
import LazyListT, * as LazyList from "../test/_lazylist.ts";

export default interface RoseTreeT<A> {
  root: A;
  children: LazyListT<RoseTreeT<A>>;
}

export const of = <A>(root: A): RoseTreeT<A> => ({
  root,
  children: LazyList.empty(),
});

export const extract = <A>(rt: RoseTreeT<A>): A => rt.root;

export const children = <A>(rt: RoseTreeT<A>): LazyListT<RoseTreeT<A>> =>
  rt.children;

export const concat = <A>(
  child: RoseTreeT<A>,
  parent: RoseTreeT<A>,
): RoseTreeT<A> => ({
  root: parent.root,
  children: LazyList.cons(child, parent.children),
});

export const map = <A, B>(f: (a: A) => B, rt: RoseTreeT<A>): RoseTreeT<B> => ({
  root: f(rt.root),
  children: LazyList.map((rt) => map(f, rt), rt.children),
});

export const filter = <A>(
  pred: (a: A) => boolean,
  tree: RoseTreeT<A>,
): MaybeT<RoseTreeT<A>> => {
  const maybeKeep = (x: A): MaybeT<A> => pred(x) ? Maybe.of(x) : Maybe.empty();
  return filterMap(maybeKeep, tree);
};

export const filterMap = <A, B>(
  f: (a: A) => MaybeT<B>,
  tree: RoseTreeT<A>,
): MaybeT<RoseTreeT<B>> => {
  const root = f(tree.root);

  if (root.tag === "some") {
    return Maybe.of({
      root: root.value,
      children: LazyList.filterMap(
        (tree: RoseTreeT<A>) => filterMap(f, tree),
        tree.children,
      ),
    });
  }

  return Maybe.empty();
};

export const filterBranches = <A>(
  pred: (a: A) => boolean,
  tree: RoseTreeT<A>,
): RoseTreeT<A> => ({
  root: tree.root,
  children: LazyList.filterMap((tree) => filter(pred, tree), tree.children),
});

export const join = <A>(tree: RoseTreeT<RoseTreeT<A>>): RoseTreeT<A> => ({
  root: tree.root.root,
  children: LazyList.concat(
    tree.root.children,
    LazyList.map(join, tree.children),
  ),
});
