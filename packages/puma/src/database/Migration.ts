import * as Knex from "knex";

import { Frozen } from "../decorator";

export type MigrationFn = (knex: Knex) => Knex.SchemaBuilder;

@Frozen
export class Migration {
  constructor(public up: MigrationFn, public down: MigrationFn) {}
}
