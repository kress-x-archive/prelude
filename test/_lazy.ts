type LazyT<A> =
  | { tag: "lazy"; thunk: () => A }
  | { tag: "memo"; value: A };

export default LazyT;

export const of = <A>(value: A): LazyT<A> => ({ tag: "memo", value });

export const ofThunk = <A>(thunk: () => A): LazyT<A> => ({
  tag: "lazy",
  thunk,
});

export const extract = <A>(piece: LazyT<A>): A =>
  piece.tag === "memo" ? piece.value : piece.thunk();

export const map = <A, B>(f: (a: A) => B, la: LazyT<A>): LazyT<B> =>
  ofThunk(() => f(extract(la)));
