type MaybeT<A> =
  | { tag: "none" }
  | { tag: "some"; value: A };

export default MaybeT;

const empty_: MaybeT<unknown> = { tag: "none" };

export const empty = <A>(): MaybeT<A> => empty_;

export const of = <A>(a: A): MaybeT<A> => ({ tag: "some", value: a });

export const map = <A, B>(f: (a: A) => B, ma: MaybeT<A>): MaybeT<B> => {
  if (ma.tag === "none") return ma;
  return of(f(ma.value));
};

export const ap = <A, B>(mf: MaybeT<(x: A) => B>, ma: MaybeT<A>): MaybeT<B> => {
  return mf.tag === "none" || ma.tag === "none"
    ? empty_
    : of(mf.value(ma.value));
};

export const join = <A>(mma: MaybeT<MaybeT<A>>): MaybeT<A> => {
  return mma.tag === "none" ? empty_ : mma.value;
};

export const chain = <A, B>(
  f: (x: A) => MaybeT<B>,
  ma: MaybeT<A>,
): MaybeT<B> => {
  return ma.tag === "none" ? empty_ : f(ma.value);
};
