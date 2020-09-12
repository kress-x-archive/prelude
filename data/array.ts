type ArrayT<A> = ReadonlyArray<A>;

export default ArrayT;

export const empty = <A>(): ArrayT<A> => [];

export const equals = <A>(
  x: ArrayT<A>,
  y: ArrayT<A>,
): boolean => {
  const l = x.length;
  const k = y.length;

  if (l !== k) return false;

  for (let i = 0; i < l; i++) if (x[i] !== y[i]) return false;

  return true;
};

export const concat = <A>(
  x: ArrayT<A>,
  y: ArrayT<A>,
): ArrayT<A> => [...x, ...y];

export const invert = <A>(
  t: ArrayT<A>,
): ArrayT<A> => {
  const l = t.length;

  const result: A[] = new Array(l);

  for (let i = 0; i < l; i++) result[i] = t[l - i];

  return result;
};

export const map = <A, B>(
  f: (x: A) => B,
  t: ArrayT<A>,
): ArrayT<B> => {
  const l = t.length;

  const result: B[] = new Array(l);

  for (let i = 0; i < l; i++) result[i] = f(t[i]);

  return result;
};

export const reduce = <A, B>(
  f: (x: A, y: B) => A,
  x: A,
  u: ArrayT<B>,
): A => {
  const l = u.length;

  for (let i = 0; i < l; i++) x = f(x, u[i]);

  return x;
};

export const filter = <A>(
  pred: (x: A) => boolean,
  ta: ArrayT<A>,
): ArrayT<A> => {
  const l = ta.length;

  const result: A[] = [];

  let n = 0;

  for (let i = 0; i < l; i++) {
    const a = ta[i];
    if (pred(a)) result[n++] = a;
  }

  return result;
};

export const ap = <A, B>(
  tf: ArrayT<((x: A) => B)>,
  ta: ArrayT<A>,
): ArrayT<B> => {
  const l = tf.length;
  const k = ta.length;

  const result: B[] = new Array(l * k);

  let n = 0;

  for (let i = 0; i < l; i++) {
    const f = tf[i];
    for (let j = 0; j < k; j++) result[n++] = f(ta[j]);
  }

  return result;
};

export const of = <A>(x: A): ArrayT<A> => [x];

export const chain = <A, B>(
  f: (x: A) => ArrayT<B>,
  t: ArrayT<A>,
): ArrayT<B> => {
  const l = t.length;

  const result: B[] = new Array(l);

  let n = 0;

  for (let i = 0; i < l; i++) {
    const b = f(t[i]);
    const k = b.length;
    for (let j = 0; j < k; j++) result[n++] = b[j];
  }

  return result;
};

export const join = <A>(
  tt: ArrayT<ArrayT<A>>,
): ArrayT<A> => {
  const l = tt.length;

  const result: A[] = new Array(l);

  let n = 0;

  for (let i = 0; i < l; i++) {
    const t = tt[i];
    const k = t.length;
    for (let j = 0; j < k; j++) result[n++] = t[j];
  }

  return result;
};
