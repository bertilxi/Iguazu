import * as Knex from "knex";

import { Frozen } from "../decorator";

export type SeedFn = (knex: Knex) => Promise<any>;

@Frozen
export class Seed {
  constructor(public seed: SeedFn) {}
}
