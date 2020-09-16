type EitherT<A, B> =
  | { tag: "left"; value: A }
  | { tag: "right"; value: B };

export default EitherT;

export const of = <A, B>(b: B): EitherT<A, B> => ({ tag: "right", value: b });

export const map = <A, B, C>(
  f: (b: B) => C,
  ma: EitherT<A, B>,
): EitherT<A, C> => {
  if (ma.tag === "right") return ({ tag: "right", value: f(ma.value) });
  return ma;
};
