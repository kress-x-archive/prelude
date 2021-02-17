> USE [PURIFREE](https://github.com/nythrox/purifree) INSTEAD


# prelude

_a base library for functional programming in [deno][deno]_

## Roadmap

:warning:	WATCH OUT!

- semver won't be enforced until v1.0.0
- partial application and other tuple related functions won't be available until deno supports [TypeScript 4.0][ts4x]

### Goals

- provide [interfaces][static-land] corresponding to [static-land spec][spec] type classes and factory functions for implementing its instances
- provide a good replacement for libraries like [fp-ts][fp-ts], [ramda][ramda], [hkts][hkts] and [lodash][lodash]
- provide interfaces for additional [purescript][purs] based type classes
- provide some basic (primitives, Maybe, Either, etc...) instances for existing type classes
- support and idioms for deno comes first, but browser and node should be compatible

### Non-Goals

- break compatibility with static-land
- provide every type class and instance corresponding to haskell/purescript 
- requiring abstractions with higher runtime cost than handwritten functional code

## Documentation

Is currently a work in progress and not a priority until instances for most primitive types are implemented.

## Known limitations

- every kind is limited to a single parameter (but kinds can yield kinds)
- testing kind applications is [weird][ktest]
- a useless expression is required to check type class instances:

```ts
(():
  & Monoid<Ap<ArrayKind, unknown>>
  & Setoid<Ap<ArrayKind, unknown>>
  & Semigroup<Ap<ArrayKind, unknown>>
  & Group<Ap<ArrayKind, unknown>>
  & Functor<ArrayKind>
  & Foldable<ArrayKind>
  & Filterable<ArrayKind>
  & Apply<ArrayKind>
  & Applicative<ArrayKind>
  & Chain<ArrayKind>
  & Monad<ArrayKind> => ({
  equals,
  empty,
  concat,
  map,
  reduce,
  filter,
  ap,
  of,
  chain,
  join,
  invert,
}));
```

## Additions to static-land

- Monads are required to have a [join][mjoin] method, a derive function is available to help with that.

## Related work

- [encoding higher kinded types in typescript without declaration merging][lazythis]
- inspired by [hkts][hkts], [fp-ts][fp-ts] and [purescript][purs]

## For Developers

If you want to contribute to prelude:

1. clone this repository
2. make sure you have deno installed in your path
3. install the `pre-commit` running:
    - on linux/unix-likes: `./scripts/hook` from the repository root directory
    - on windows with [cmder][term]: `sh scripts/hook` from the repository root directory
4. run scripts from the repository root directory

Thanks!

[deno]: https://deno.land
[ts4x]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html
[static-land]: https://github.com/kress95/prelude/blob/master/static-land.ts
[spec]: https://github.com/fantasyland/static-land
[fp-ts]: https://github.com/gcanti/fp-ts
[ramda]: https://github.com/ramda/ramda
[hkts]: https://github.com/pelotom/hkts
[lodash]: https://github.com/lodash/lodash
[purs]: https://github.com/purescript/purescript
[ktest]: https://github.com/kress95/prelude/blob/master/kind_test.ts
[mjoin]: https://github.com/kress95/prelude/blob/master/control/monad.ts#L6
[lazythis]: https://gist.github.com/ENvironmentSet/1662a140f99381bc85fd6be51ecdcbb5
[term]: https://cmder.net
