import { Seed } from "@iguazu/puma";

const tableName = "role";

export = new Seed(async knex => {
  await knex(tableName).del();
  return knex(tableName).insert([
    { name: "super admin" },
    { name: "admin" },
    { name: "user" }
  ]);
});
