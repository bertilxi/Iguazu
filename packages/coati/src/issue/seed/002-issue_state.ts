import { Seed } from "@iguazu/puma";

const tableName = "issue_state";

export = new Seed(async knex => {
  await knex(tableName).del();
  return knex(tableName).insert([
    { name: "open" },
    { name: "in progress" },
    { name: "done" },
    { name: "not done" },
    { name: "duplicate" }
  ]);
});
