import * as Lazy from "./_lazy.ts";
import LazyListT, * as LazyList from "./_lazylist.ts";
import MaybeT, * as Maybe from "../data/maybe.ts";

export default interface SimplifyT<A> {
  (a: A): LazyListT<A>;
}

export const simplify = <A>(
  pred: (a: A) => boolean,
  simplify: SimplifyT<A>,
  value: A,
): A => {
  const helper = (lazylist: LazyListT<A>, value0: A): A => {
    const value1 = Lazy.extract(lazylist);
    if (value1.tag === "nil") return value0;
    const { head } = value1;
    return pred(head)
      ? helper(simplify(head), head)
      : helper(value1.tail, value0);
  };

  return helper(simplify(value), value);
};

export const empty = <A>(): SimplifyT<A> => LazyList.empty;

export const bool: SimplifyT<boolean> = (b: boolean) =>
  b ? LazyList.of(false) : LazyList.empty();

const { ceil } = Math;

const seriesInt = (low: number, high: number): LazyListT<number> => {
  if (low >= high) return LazyList.empty();
  if (low === high - 1) return LazyList.of(low);
  const low1 = low + ceil((high - low) / 2);
  return LazyList.cons(low1, seriesInt(low1, high));
};

export const int: SimplifyT<number> = (n) =>
  n < 0 ? LazyList.map((x) => x * -1, seriesInt(0, -n)) : seriesInt(0, n);

const { max } = Math;

export const atLeastInt = (min: number): SimplifyT<number> =>
  (n) =>
    n < 0 && n >= min
      ? LazyList.map((x) => x * -1, seriesInt(0, -n))
      : seriesInt(max(0, min), n);

const seriesFloat = (low: number, high: number): LazyListT<number> => {
  if (low >= (high - 0.0001)) {
    if (high !== 0.000001) return LazyList.of(low + 0.000001);
    return LazyList.empty();
  }
  const low1 = low + ((high - low) / 2);
  return LazyList.cons(low1, seriesFloat(low1, high));
};

export const float: SimplifyT<number> = (n) =>
  n < 0 ? LazyList.map((x) => x * -1, seriesFloat(0, -n)) : seriesFloat(0, n);

export const convert = <A, B>(
  f: (a: A) => B,
  g: (b: B) => A,
  simplifier: SimplifyT<A>,
): SimplifyT<B> => (b: B) => LazyList.map(f, simplifier(g(b)));

const gt0 = (x: number) => x > 0;
const dv2 = (x: number) => Math.floor(x / 2);

const lazylist = <A>(simplify: SimplifyT<A>): SimplifyT<LazyListT<A>> =>
  (l: LazyListT<A>) =>
    Lazy.ofThunk(() => {
      const n0 = LazyList.length(l);

      const simplifyOneHelp = (lst: LazyListT<A>): LazyListT<LazyListT<A>> =>
        Lazy.ofThunk(() => {
          const value = Lazy.extract(lst);
          if (value.tag === "nil") return Lazy.extract(LazyList.empty());
          return Lazy.extract(LazyList.concat(
            LazyList.map(
              (val) => LazyList.cons(val, value.tail),
              simplify(value.head),
            ),
            LazyList.map<LazyListT<A>, LazyListT<A>>(
              (xs) => LazyList.cons(value.head, xs),
              simplifyOneHelp(value.tail),
            ),
          ));
        });

      const removes = (
        k: number,
        n1: number,
        l: LazyListT<A>,
      ): LazyListT<LazyListT<A>> =>
        Lazy.ofThunk(() => {
          if (k > n1) return Lazy.extract(LazyList.empty());
          if (LazyList.isEmpty(l)) {
            return Lazy.extract(LazyList.of(LazyList.empty()));
          }

          const init = LazyList.take(k, l);
          const tail = LazyList.drop(k, l);

          return Lazy.extract(
            LazyList.cons(
              tail,
              LazyList.map(
                (xs) => LazyList.concat(init, xs),
                removes(k, n1 - k, tail),
              ),
            ),
          );
        });

      return Lazy.extract(
        LazyList.concat(
          LazyList.chain(
            (k) => removes(k, n0, l),
            LazyList.takeWhile(gt0, LazyList.iterate(dv2, n0)),
          ),
          simplifyOneHelp(l),
        ),
      );
    });

export const array = <A>(simplify: SimplifyT<A>): SimplifyT<A[]> =>
  convert<LazyListT<A>, A[]>(
    LazyList.toArray,
    LazyList.ofArray,
    lazylist(simplify),
  );

const toCharCode = (x: string): number => x.charCodeAt(0);

export const char: SimplifyT<string> = convert(
  String.fromCharCode,
  toCharCode,
  int,
);

export const atLeastChar = (ch: string): SimplifyT<string> =>
  convert(String.fromCharCode, toCharCode, atLeastInt(toCharCode(ch)));

export const character = atLeastChar(String.fromCharCode(32));

export const string = convert(
  (a: string[]): string => a.join(""),
  (a: string): string[] => a.split(""),
  array(character),
);

export const maybe = <A>(simplify: SimplifyT<A>): SimplifyT<MaybeT<A>> =>
  (m) =>
    m.tag === "none" ? LazyList.empty() : LazyList.cons<MaybeT<A>>(
      Maybe.empty(),
      LazyList.map<A, MaybeT<A>>(Maybe.of, simplify(m.value)),
    );
