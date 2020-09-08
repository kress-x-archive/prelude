export interface Kind<B = unknown, A = unknown> {
  _: A;
  $: B;
}

export default Kind;

export type Kind2<A = unknown, B = unknown, C = unknown> = Kind<Kind<C, B>, A>;

export type Ap<T extends Kind, A = unknown> = (T & { _: A })["$"];

export type Ap2<T extends Kind2, A = unknown, B = unknown> = Ap<Ap<T, A>, B>;

export interface Compose<A extends Kind2, B extends Kind> extends Kind {
  $: Ap<A, Ap<B, this["_"]>>;
}

export interface Flip<T extends Kind2> extends Kind {
  $: FlipKind<T, this["_"]>;
}

interface FlipKind<T extends Kind2<A>, A> extends Kind {
  $: Ap2<T, this["_"], A>;
}

export type _ = "_";
