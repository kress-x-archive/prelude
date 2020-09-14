import { SeedT } from "../data/random.ts";

export interface TestDefinition {
  fn: () => void | Promise<void>;
  name: string;
  ignore?: boolean;
  /** If at lease one test has `only` set to true, only run tests that have
   * `only` set to true and fail the test suite. */
  only?: boolean;
  /** Check that the number of async completed ops after the test is the same
   * as number of dispatched ops. Defaults to true.*/
  sanitizeOps?: boolean;
  /** Ensure the test case does not "leak" resources - ie. the resource table
   * after the test has exactly the same contents as before the test. Defaults
   * to true. */
  sanitizeResources?: boolean;
}

export interface Test {
  (t: TestDefinition): void;
  (name: string, fn: () => void | Promise<void>): void;
}

export interface AssertEquals {
  <T>(actual: T, expected: T, msg?: string): void;
  (actual: unknown, expected: unknown, msg?: string): void;
}

export interface Framework {
  runs: number;
  seed: SeedT;
  test: (msg: string, fn: () => void) => void;
  assertEquals: AssertEquals;
}
