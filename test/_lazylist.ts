import MaybeT from "../data/maybe.ts";
import * as Array from "../data/array.ts";
import LazyT, * as Lazy from "./_lazy.ts";

type LazyListViewT<A> =
  | { tag: "nil" }
  | { tag: "cons"; head: A; tail: LazyListT<A> };

type LazyListT<A> = LazyT<LazyListViewT<A>>;

export default LazyListT;

const nil_: LazyListViewT<unknown> = { tag: "nil" };

const empty_: LazyListT<unknown> = Lazy.ofThunk(() => nil_);

export const empty = <A>(): LazyListT<A> => empty_ as LazyListT<A>;

export const cons = <A>(a: A, list: LazyListT<A>): LazyListT<A> =>
  Lazy.ofThunk(() => ({ tag: "cons", head: a, tail: list }));

export const isEmpty = (list: LazyListT<unknown>): boolean =>
  Lazy.extract(list).tag === "nil";

const concat_ = <A>(
  list1: LazyListT<A>,
  list2: LazyListT<A>,
): LazyListViewT<A> => {
  const value = Lazy.extract(list1);
  if (value.tag === "nil") return Lazy.extract(list2);
  return { tag: "cons", head: value.head, tail: concat(value.tail, list2) };
};

export const concat = <A>(
  list1: LazyListT<A>,
  list2: LazyListT<A>,
): LazyListT<A> => Lazy.ofThunk(() => concat_(list1, list2));

export const map = <A, B>(f: (a: A) => B, list: LazyListT<A>): LazyListT<B> =>
  Lazy.ofThunk(() => {
    const value = Lazy.extract(list);
    if (value.tag === "nil") return value;
    return { tag: "cons", head: f(value.head), tail: map(f, value.tail) };
  });

export const reduce = <A, B>(
  f: (a: A, b: B) => B,
  b: B,
  list: LazyListT<A>,
): B => {
  for (
    let value = Lazy.extract(list);
    value.tag === "cons";
    value = Lazy.extract(value.tail)
  ) {
    b = f(value.head, b);
  }
  return b;
};

export const filterMap_ = <A, B>(
  trans: (a: A) => MaybeT<B>,
  list: LazyListT<A>,
): LazyListViewT<B> => {
  const value1 = Lazy.extract(list);
  if (value1.tag === "nil") return value1;
  const value2 = trans(value1.head);
  if (value2.tag === "some") {
    return {
      tag: "cons",
      head: value2.value,
      tail: filterMap(trans, value1.tail),
    };
  }
  return filterMap_(trans, value1.tail);
};

export const filterMap = <A, B>(
  trans: (a: A) => MaybeT<B>,
  list: LazyListT<A>,
): LazyListT<B> => Lazy.ofThunk(() => filterMap_(trans, list));

export const of = <A>(a: A): LazyListT<A> =>
  Lazy.ofThunk(() => ({ tag: "cons", head: a, tail: empty_ as LazyListT<A> }));

const consFlip = <A>(list: LazyListT<A>, a: A): LazyListT<A> => cons(a, list);

export const ofArray = <A>(arr: A[]): LazyListT<A> =>
  Array.reduce<LazyListT<A>, A>(consFlip, empty(), arr);

export const toArray = <A>(list: LazyListT<A>): A[] => {
  const result: A[] = [];

  for (
    let value = Lazy.extract(list);
    value.tag === "cons";
    value = Lazy.extract(value.tail)
  ) {
    result.push(value.head);
  }

  return result;
};

export const join = <A>(list: LazyListT<LazyListT<A>>): LazyListT<A> =>
  Lazy.ofThunk(() => {
    const value = Lazy.extract(list);
    if (value.tag === "nil") return value;
    return concat_(value.head, join(value.tail));
  });

export const chain = <A, B>(
  f: (a: A) => LazyListT<B>,
  list: LazyListT<A>,
): LazyListT<B> => join(map(f, list));

const sum = (a: unknown, n: number) => n + 1;

export const length = (list: LazyListT<unknown>) => reduce(sum, 0, list);

export const take = <A>(n: number, list: LazyListT<A>): LazyListT<A> =>
  Lazy.ofThunk(() => {
    if (n <= 0) return nil_;
    const value = Lazy.extract(list);
    if (value.tag === "nil") return value;
    return { tag: "cons", head: value.head, tail: take(n - 1, value.tail) };
  });

export const takeWhile = <A>(
  pred: (a: A) => boolean,
  list: LazyListT<A>,
): LazyListT<A> =>
  Lazy.ofThunk(() => {
    const value = Lazy.extract(list);
    if (value.tag === "nil") return value;
    return pred(value.head)
      ? { tag: "cons", head: value.head, tail: takeWhile(pred, value.tail) }
      : value;
  });

export const drop_ = <A>(n: number, list: LazyListT<A>): LazyListViewT<A> => {
  if (n <= 0) return Lazy.extract(list);
  const value = Lazy.extract(list);
  if (value.tag === "nil") return value;
  return drop_(n - 1, value.tail);
};

export const drop = <A>(n: number, list: LazyListT<A>): LazyListT<A> =>
  Lazy.ofThunk(() => drop_(n, list));

export const iterate = <A>(f: (a: A) => A, a: A): LazyListT<A> =>
  Lazy.ofThunk(() => ({ tag: "cons", head: a, tail: iterate(f, f(a)) }));
