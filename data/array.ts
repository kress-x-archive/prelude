export const empty = <A>(): ReadonlyArray<A> => [];

export const equals = <A>(
  x: ReadonlyArray<A>,
  y: ReadonlyArray<A>,
): boolean => {
  const l = x.length;
  const k = y.length;

  if (l !== k) return false;

  for (let i = 0; i < l; i++) if (x[i] !== y[i]) return false;

  return true;
};

export const concat = <A>(
  x: ReadonlyArray<A>,
  y: ReadonlyArray<A>,
): ReadonlyArray<A> => [...x, ...y];

export const invert = <A>(
  t: ReadonlyArray<A>,
): ReadonlyArray<A> => {
  const l = t.length;

  const result: A[] = new Array(l);

  for (let i = 0; i < l; i++) result[i] = t[l - i];

  return result;
};

export const map = <A, B>(
  f: (x: A) => B,
  t: ReadonlyArray<A>,
): ReadonlyArray<B> => {
  const l = t.length;

  const result: B[] = new Array(l);

  for (let i = 0; i < l; i++) result[i] = f(t[i]);

  return result;
};

export const reduce = <A, B>(
  f: (x: A, y: B) => A,
  x: A,
  u: ReadonlyArray<B>,
): A => {
  const l = u.length;

  for (let i = 0; i < l; i++) x = f(x, u[i]);

  return x;
};

export const filter = <A>(
  pred: (x: A) => boolean,
  ta: ReadonlyArray<A>,
): ReadonlyArray<A> => {
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
  tf: ReadonlyArray<((x: A) => B)>,
  ta: ReadonlyArray<A>,
): ReadonlyArray<B> => {
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

export const of = <A>(x: A): ReadonlyArray<A> => [x];

export const chain = <A, B>(
  f: (x: A) => ReadonlyArray<B>,
  t: ReadonlyArray<A>,
): ReadonlyArray<B> => {
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
  tt: ReadonlyArray<ReadonlyArray<A>>,
): ReadonlyArray<A> => {
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
