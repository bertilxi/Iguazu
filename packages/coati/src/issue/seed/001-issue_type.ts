import { Seed } from "@iguazu/puma";

const tableName = "issue_type";

export = new Seed(async knex => {
  await knex(tableName).del();
  return knex(tableName).insert([
    { name: "bug" },
    { name: "improvement" },
    { name: "feature" },
    { name: "other" }
  ]);
});
